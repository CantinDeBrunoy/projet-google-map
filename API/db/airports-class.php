<?php

class Airports {

	// table
	private $db;
    private $table = "airports";

    // object properties
    public $id;
    public $name;
    public $latitude;
    public $longitude;

    /**
     * Constructor with $db
     *
     * @param $db
     */
    public function __construct($db){
        $this->db = $db;
    }


    /**
     * Create user
     *
     * @return boolean
     */

     //creer un airport, prends un param un airport(name,longitude,latitude)
	public function create ($data) {
        $sql = "INSERT INTO airports(name,latitude,longitude) values('$data->name','$data->latitude','$data->longitude')";
        
        if($this->db->query($sql)){
            return true;
        }
        return false;

	}

    /**
     * Read all users
     *
     * @return array
     */

     //renvoie les airports
	public function read() {
		$sql = 'SELECT * FROM airports';
        $query = $this->db->query($sql);

        $jsonArray = array();
        while( $row = $query->fetchArray(SQLITE3_ASSOC)){
            $jsonArray[] = $row;
        }
        return $jsonArray;
	}

    /**
     * Update user
     *
     * @return boolean
     */

     //update un airport, prends un param un airport(id,name,longitude,latitude)
	public function update($data) {
        $sql =
        "UPDATE airports
        SET name = '$data->name', latitude='$data->latitude', longitude = '$data->longitude'
        WHERE id=$data->id";

        if($this->db->query($sql)){
            return true;
        }
        return false;
	}

    /**
     * Delete user
     *
     * @return boolean
     */

     //delete un airport, prends un param un airport(id)
	public function delete ($data) {
        $sql = "DELETE FROM airports WHERE id=$data->id;";
        if($this->db->query($sql)){
            return true;
        }
        return false;

	}
}

?>
