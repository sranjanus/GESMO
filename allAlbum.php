<?php
include_once 'dbconfig.php';

$Key="Break out";
$sql = "SELECT DISTINCT Album FROM tbl_uploads ";
$result = mysqli_query($link, $sql) or die("Error in Selecting " . mysqli_error($link));

 $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        
        $emparray[0]="Albums";
        $emparray[]= $row;
    }

    echo json_encode($emparray);

    //close the db connection //juliu1423
    mysqli_close($link);

?>