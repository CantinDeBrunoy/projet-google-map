<?php

 include('headers.php');
 include('../db/airports-class.php');

 $db = new SQLite3('../db/store.db');
 $airports = new Airports($db);

 //TODO Check 
 $_SERVER['REQUEST_METHOD'];

switch( $_SERVER['REQUEST_METHOD'] ) {
    //cas ou on recoit un get
    case "GET":

        $all_airports = $airports->read();
        http_response_code(200);
        echo json_encode(["airports" => $all_airports]);
        break;
    
    //cas ou on recoit un post
    case "POST":


        $data = json_decode(file_get_contents("php://input"));
        if($airports->create($data)){
            $all_airports = $airports->read();
            http_response_code(200);
            echo json_encode(["airports" => $all_airports]);
        }
        else{
            http_response_code(503);
        }
        
        break;
        //cas ou on recoit un put
    case "PUT":

        $data = json_decode(file_get_contents("php://input"));
        if($airports->update($data)){
            $all_airports = $airports->read();
            http_response_code(200);
            echo json_encode(["airports" => $all_airports]);
        }
        else{
            http_response_code(503);
        }       
        break;
        //cas ou on recoit un delete
    case "DELETE":

        $data = json_decode(file_get_contents("php://input"));
        if($airports->delete($data)){
            $all_airports = $airports->read();
            http_response_code(200);
            echo json_encode(["airports" => $all_airports]);
        }
        else{
            http_response_code(503);
        }

        
        break;

    default:

        break;
}