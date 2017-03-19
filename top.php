<?php
include_once 'dbconfig.php';

$Key="EDM";
$sql = "SELECT * FROM tbl_uploads WHERE Genre='$Key' ORDER BY id desc limit 2";
$result = mysqli_query($link, $sql) or die("Error in Selecting " . mysqli_error($link));

 $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        
        $emparray[0]="top_10";
        $emparray[]= $row;
    }

    echo json_encode($emparray);

    //close the db connection //juliu1423
    mysqli_close($link);

?>