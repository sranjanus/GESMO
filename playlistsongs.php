<?php
include_once 'dbconfig.php';

$uri = $_SERVER['QUERY_STRING'];
parse_str($uri, $output);
$playlist_id = intval($output['playlist_id']);

$sql1 = "SELECT * FROM playlistmapping WHERE playlistid = '$playlist_id'";

$result1 = mysqli_query($link, $sql1) or die("Error in Selecting " . mysqli_error($link));

$emparray = array();
while($row1 =mysqli_fetch_assoc($result1))
{
    $songid = $row1['songid'];
    $sql2 = "SELECT * FROM tbl_uploads WHERE id = '$songid'";

    $result2 = mysqli_query($link, $sql2) or die("Error in Selecting " . mysqli_error($link));

    while ($row2 = mysqli_fetch_assoc($result2)) {
       	$emparray[]= $row2;
    }
}

echo json_encode($emparray);

//close the db connection //juliu1423
mysqli_close($link);

?>