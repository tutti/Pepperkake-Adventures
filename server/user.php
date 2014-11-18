<?php

require_once "database.php";

class User {
    private static $db;
    private static $current_user;
    private $authenticated = false;
    private $id = 0;
    public $username = "";
    private $password = "";
    public $admin = false;
    
    private static function do_db_work()
    {
        if (!self::$db) {
            self::$db = Database::get();
            self::$db->prepare("get_user_by_username", "SELECT * FROM user WHERE username=:username");
            self::$db->prepare("create_user", "INSERT INTO user (username, password) VALUES (:username, :password)");
            self::$db->prepare("save_user", "UPDATE user SET username=:username, admin=:admin WHERE id=:id");
            self::$db->prepare("change_user_password", "UPDATE user SET password=:password WHERE id=:id");
            
            self::$db->prepare("has_folder", "SELECT id FROM bruker_mappe WHERE bruker=:bruker AND mappe=:mappe");
            self::$db->prepare("has_level", "SELECT id FROM bruker_brett WHERE bruker=:bruker, brett=(SELECT id FROM brett WHERE mappe=:mappe, fil=:fil)");
            self::$db->prepare("unlock_folder", "INSERT IGNORE INTO bruker_mappe (bruker, mappe) VALUES (:bruker, :mappe)");
            self::$db->prepare("unlock_level", "INSERT IGNORE INTO bruker_brett (bruker, brett) VALUES (:bruker, (SELECT id FROM brett WHERE mappe=:mappe AND fil=:fil))");
            self::$db->prepare("level_list", "SELECT DISTINCT(brett.id), brett.mappe, brett.fil, bruker_brett.id AS apnet, bruker_rekorder.tid, bruker_rekorder.samlet FROM brett LEFT JOIN bruker_brett ON brett.id = bruker_brett.brett AND bruker_brett.bruker=:bruker LEFT JOIN bruker_rekorder ON brett.id = bruker_rekorder.brett WHERE (mappe IN (SELECT mappe FROM bruker_mappe WHERE bruker=:bruker) OR mappe='standard') GROUP BY brett.id");
            self::$db->prepare("level_complete", "INSERT INTO bruker_rekorder (bruker, brett, tid, samlet) VALUES (:bruker, :brett, :tid, :samlet) ON DUPLICATE KEY UPDATE tid=VALUES(tid), samlet=VALUES(samlet)");
        }
    }
    
    /**
     * Returns the User object of the user that's currently logged in.
     */
    public static function get_current()
    {
        if (self::$current_user) {
            return self::$current_user;
        }
        return self::from_session();
    }
    
    /**
     * Creates a User object for the user currently logged in.
     * If there is no user currently logged in, does nothing.
     */
    public static function from_session()
    {
        if (array_key_exists('username', $_SESSION)) {
            self::$current_user = new User($_SESSION['username']);
            self::$current_user->authenticated = true;
            return self::$current_user;
        }
        return false;
    }
    
    /**
     * Loads a user's data from the database.
     * This DOES NOT authenticate the user.
     * It also does not log the user in.
     * A User object is not meant to represent the currently logged in
     * user, but ANY user in the system.
     */
    public function __construct($username)
    {
        self::do_db_work();
        self::$db->bind("get_user_by_username", ":username", $username);
        $result = self::$db->getOne("get_user_by_username");
        $this->id = $result['id'];
        $this->username = $username;
        $this->admin = $result['admin'];
        $this->password = $result['password'];
        $this->authenticated = false;
    }
    
    /**
     * Saves a user's data to the database.
     * Only the public fields are changed.
     */
    public function __destruct()
    {
        $this->save();
    }
    
    /**
     * Checks that the user's supplied password matches the one in the
     * database. Note that if the password matches, this user will be made
     * the currently logged in user.
     * The password passed to this function must be the plain text password.
     */
    public function authenticate($password)
    {
        if (password_verify($password, $this->password)) {
            if (self::$current_user) {
                self::$current_user->authenticated = false;
            }
            $this->authenticated = true;
            self::$current_user = $this;
            $_SESSION['username'] = $this->username;
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Logs the user out.
     */
    public function log_out() {
        if (!$this->authenticated) return;
        self::$current_user = null;
        $this->authenticated = false;
        $_SESSION['username'] = null;
        session_destroy();
    }
    
    /**
     * Changes the user's password.
     * This has no safety measures; verifying the user, making sure the password
     * is entered correctly, and all such checks must be made before this call.
     * However, the user WILL need to be authenticated.
     */
    public function change_password($newpassword)
    {
        if (!$this->authenticated) {
            throw new Exception("Not authenticated");
        }
        $this->password = password_hash($newpassword, PASSWORD_DEFAULT);
        self::$db->bind("change_user_password", ":id", $this->id);
        self::$db->bind("change_user_password", ":password", $this->password);
        self::$db->execute("change_user_password");
    }
    
    /**
     * Saves the user's data to the database.
     * This is done automatically on object destruction, but can also be called
     * before that to ensure it happens.
     */
    public function save()
    {
        self::$db->bind("save_user", ":id", $this->id);
        self::$db->bind("save_user", ":username", $this->username);
        self::$db->bind("save_user", ":admin", $this->admin);
        self::$db->execute("save_user");
    }
    
    public static function user_exists($username) {
        self::do_db_work();
        self::$db->bind("get_user_by_username", ":username", $username);
        $user = self::$db->getFirst("get_user_by_username");
        if ($user['id']) return true;
        return false;
    }
    
    /**
     * Creates a new user and returns it.
     * The user is automatically saved to the database.
     */
    public static function create($username, $password) {
        self::do_db_work();
        self::$db->bind("create_user", ":username", $username);
        self::$db->bind("create_user", ":password", password_hash($password, PASSWORD_DEFAULT));
        self::$db->execute("create_user");
        // Application specific start
        $u = new User($username);
        $u->apne_brett("standard", "1.json");
        return $u;
        // Application specific end
        //return new User($username);
    }
    
    /**
     * Application specific functions
     */
    public function har_mappe($brettmappe) {
        self::$db->bind("has_folder", ":bruker", $this->id);
        self::$db->bind("has_folder", ":mappe", $brettmappe);
        $r = self::$db->getFirst("has_folder");
        if ($r['id']) return true;
        return false;
    }
    
    public function apne_mappe($brettmappe) {
        self::$db->bind("unlock_folder", ":mappe", $brettmappe);
        self::$db->bind("unlock_folder", ":bruker", $this->id);
        self::$db->execute("unlock_folder");
    }
    
    public function har_brett($brettmappe, $brettfil) {
        self::$db->bind("has_level", ":mappe", $brettmappe);
        self::$db->bind("has_level", ":fil", $brettfil);
        self::$db->bind("has_level", ":bruker", $this->id);
        $r = self::$db->getFirst("has_level");
        if ($r['id']) return true;
        return false;
    }
    
    public function apne_brett($brettmappe, $brettfil) {
        $this->apne_mappe($brettmappe);
        self::$db->bind("unlock_level", ":mappe", $brettmappe);
        self::$db->bind("unlock_level", ":fil", $brettfil);
        self::$db->bind("unlock_level", ":bruker", $this->id);
        self::$db->execute("unlock_level");
    }
    
    public function brettliste() {
        self::$db->bind("level_list", ":bruker", $this->id);
        $r = array();
        $liste = self::$db->getAll("level_list");
        foreach ($liste as $brett) {
            if (!array_key_exists($brett['mappe'], $r)) $r[$brett['mappe']] = array();
            $r[$brett['mappe']][] = [$brett['fil'], $brett['apnet'] != null ? true : false, $brett['tid'], $brett['samlet']];
        }
        return $r;
    }
}