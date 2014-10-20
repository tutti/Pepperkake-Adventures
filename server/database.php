<?php

require "config.php";

class Database {
    private static $object;
    private $db;
    private $queries;
    
    /**
     * Returns a static Database object, creating it if it doesn't exist.
     */
    public static function get()
    {
        if (!self::$object) {
            self::$object = new Database();
        }
        return self::$object;
    }
    
    /**
     * Creates a new Database object.
     * All connection info is defined in config.php.
     */
    public function __construct()
    {
        $host = DB_HOST;
        $dbname = DB_NAME;
        $this->db = new PDO(
            "mysql:host=$host;dbname=$dbname",
            DB_USER,
            DB_PASS
        );
        $this->queries = array();
    }
    
    /**
     * Prepares a new statement for the given query name.
     * Does not care whether the query name is already in use; if it is
     * the old one is overwritten.
     */
    public function prepare($queryname, $query)
    {
        $sth = $this->db->prepare($query);
        $this->queries[$queryname] = $sth;
    }
    
    /**
     * Binds a parameter value for the given query name.
     */
    public function bind($queryname, $param, $value)
    {
        $sth = $this->queries[$queryname];
        $sth->bindParam($param, $value);
    }
    
    /**
     * Runs the query for the given query name, using the previously
     * bound variables. Returns all rows in the result. Returns an empty
     * variable if there were none.
     */
    public function getAll($queryname)
    {
        $sth = $this->queries[$queryname];
        $sth->execute();
        $sth->setFetchMode(PDO::FETCH_ASSOC);
        $r = array();
        for ($row = $sth->fetch(); $row; $row = $sth->fetch()) {
            $r[] = $row;
        }
    }
    
    /**
     * Runs the query for the given query name, using the previously
     * bound variables. Returns the first row in the result, if there was one.
     * If there were none, false is returned.
     */
    public function getFirst($queryname)
    {
        $sth = $this->queries[$queryname];
        $sth->execute();
        $sth->setFetchMode(PDO::FETCH_ASSOC);
        $row = $sth->fetch();
        if ($row) return $row;
        return false;
    }
    
    /**
     * Runs the query for the given query name, using the previously
     * bound variables. Throws an error if the result doesn't consist of
     * exactly one row. If it does, returns that row.
     */
    public function getOne($queryname)
    {
        $sth = $this->queries[$queryname];
        $sth->execute();
        $sth->setFetchMode(PDO::FETCH_ASSOC);
        $row = $sth->fetch();
        if (!$row) throw new Exception();
        if ($sth->fetch()) throw new Exception();
        return $row;
    }
    
    public function getColumn($queryname)
    {
        // TODO
    }
    
    /**
     * Runs the query, returns nothing.
     */
    public function execute($queryname)
    {
        $sth = $this->queries[$queryname];
        $sth->execute();
    }
}