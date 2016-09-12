<?php
	$con=mysql_connect('localhost','root','123')or die('connect failed!');
	mysql_select_db('egoo',$con)or die('select db failed!');
	mysql_set_charset('utf8');
//接收工单数据并存入数据库
	if(isset($_GET['time'],$_GET['label'])){
        $tenantid = $_GET['tenantid'];
        $agentid = $_GET['agentid'];
        $userid = $_GET['userid'];
        $sessionId = $_GET['sessionId'];
		$time = $_GET['time'];
		$label = $_GET['label'];
		$remark = $_GET['remark'];



		//echo $_GET['type'].$_GET['time'];
 		$sql = "INSERT INTO `worksheet`
            (`tenantid`, `agentid`, `userid`,`sessionid`, `time`,`label`,`remark`)
 		    VALUES ('$tenantid', '$agentid', '$userid','$sessionId','$time','$label','$remark');";
		if(!mysql_query($sql)){
			echo "insert failed!".mysql_error();
		} else {
			echo "insert succeed!";
		}
	}else if(isset($_GET['read'])){
        //接收 读取工单的请求信息并从数据库中读取数据，然后返回数据
        $tId = $_GET['tenantid'];
        $aID = $_GET['agentid'];
        $uId = $_GET['userid'];
        if($uId==''){
            $sql2 = "SELECT `time`,`label` from worksheet
		      WHERE tenantid='$tId'  AND agentid='$aId';";
        }else {
            $sql2 = "SELECT `time`,`label` from worksheet
		      WHERE tenantid='$tId' AND userid='$uId';";
        }
        $res=mysql_query($sql2);
        if(!$res){
            echo "administrator read failed!".mysql_error();
        } else {
            //$row=mysql_fetch_row($result);//mysql_fetch_row只能提取出查询结果的第一条记录

            //提取多条记录
            $reslist = array();
            $i=0;
            while($row = mysql_fetch_row($res)){
                $reslist[$i]['time'] = $row[0];
                $reslist[$i]['label'] = $row[1];
                $i++;
            }
            //echo $reslist;
            header('Content-Type: application/json');//回传json需要加这一行，很重要
            echo json_encode($reslist);

            //var_dump(json_encode($reslist));
            //var_dump($reslist);

        }

	}else{
		echo "Args Error";
 	}
    mysql_close($con);

