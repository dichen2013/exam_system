
$(document).ready(function () {
    loadingData_Ques();
    var totalPages_Ques = 0;
    //页面加载数据
    //
    $("#choose_set").change(function(){
        if($(this).val()=='-1')
        {
            Update_Ques_Table('all');
        }else{
            Update_Ques_Table($(this).val());
        }
    });
});

function Delete_From_Question(Qid)
{
    console.log("Delete "+Qid+" From Question...");
    
    $.ajax({
        url: 'Support/action/DeleteQues.php',
        type: 'POST',
        data: { 'target': 'Question',
                'Qid'   :  Qid
             },
        dataType: 'json',
        success: function (data) {
            if(data.success==1)
            {
                dialog.tip("删除成功",Qid+"已从数据库中彻底删除！",function(){location.reload();});
            }else{
                dialog.tip("ERROR",data.message);
            }
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function Delete_From_Set(SetName,Qid)
{
    console.log("Delete "+Qid+" From Set...");
    
    $.ajax({
        url: 'Support/action/DeleteQues.php',
        type: 'POST',
        data: { 'target': SetName,
                'Qid'   : Qid
             },
        dataType: 'json',
        success: function (data) {
            if(data.success==1)
            {
                dialog.tip("删除成功","题目Q"+Qid+"已从题组["+SetName+"]中移除！",function(){location.reload();});
            }else{
                dialog.tip("ERROR",data.message);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
}

function Update_Ques_Table(sName='all')
{
    console.log("updating Table..."+sName);
    loadingData_Ques(sName);
}

function loadingData_Ques(setName='all') {
    var currentPage_Ques = $('#currentPage_Ques').val();//当前页码
    var totalPages_Ques = $('#totalPages_Ques').val();//总页码
    
    $.ajax({
        url: 'Support/action/QuesList.php',
        type: 'POST',
        data: { 'currentPage_Ques': currentPage_Ques,
                'setName'         : setName
             },
        dataType: 'json',
        success: function (data) {

            if(data.empty==1)
            {
                /// 没有数据了
                var empty_tip = "<tr><td colspan='5'>没有数据</td></tr>";
                $('#Ques_List').html(empty_tip);
            }else{
                var info = data.datas, total_Ques = data.total;
                //调用ajaxSuccess处理函数
                ajaxSuccess_Ques(total_Ques, currentPage_Ques, info);
            }
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    })

}

//给分页列表绑定事件的方法
function bindingEvent_Ques() {
    $("#first_Ques").click(function () {
        if ($("#currentPage_Ques").val() != 1 && $('#totalPages_Ques').val() != 0) {//第一页点击时无效
            $("#currentPage_Ques").val(1);//即第一页
            //加载数据
            loadingData_Ques();
        }
    })
    $("#last_Ques").click(function () {//最后一页点击时无效
        if ($("#currentPage_Ques").val() != $('#totalPages_Ques').val() && $('#totalPages_Ques').val() != 0) {
            var total_Ques = $('#totalPages_Ques').val();//把总页数存到隐藏框里   
            $("#currentPage_Ques").val(total_Ques);

            //加载数据
            loadingData_Ques();
        }
    })
    $("#down_Ques").click(function () {
        if ($('#totalPages_Ques').val() != 0) {//总页数为0时，不能点击无效，主要是考虑搜索没数据时的情况
            var n = $("#currentPage_Ques").val();
            if (n > 1) {
                n--;
            }
            else {
                n = 1;
            }
            $("#currentPage_Ques").val(n);
        }

        //加载数据
        loadingData_Ques();
    })
    $("#up_Ques").click(function () {
        if ($('#totalPages_Ques').val() != 0) {//总页数为0时，不能点击无效，主要是考虑搜索没数据时的情况
            var n = $("#currentPage_Ques").val();
            if (n < totalPages_Ques) {
                n++;
            }
            else {
                n = totalPages_Ques;
            }
            $("#currentPage_Ques").val(n);

            //加载数据
            loadingData_Ques();
        }
    })
    $(".center_Ques").click(function () {
        if ($('#totalPages_Ques').val() != 0) {//总页数为0时，不能点击无效，主要是考虑搜索没数据时的情况
            var n = $(this).text();
            if ($("#currentPage_Ques").val() != n) {
                $("#currentPage_Ques").val(n);//中间的页码，点击哪一页就去那一页

                //加载数据
                loadingData_Ques();
            }
        }
    })
}

//把ajax相同部分封装成函数调用
function ajaxSuccess_Ques(total_Ques, currentPage_Ques, info) {
    var html = ''
    for (var i = 0; i < info.length; i++) {
        html += '<tr>';
        html += '<td>' + info[i].Qid + '</td>';
        html += '<td>' + info[i].QScore + '</td>';
        html += '<td>' + info[i].TeacherName + '</td>';
        html += '<td>' + info[i].CreateTime + '</td>';
        html += "<td style='text-align:center'>" + 
                    "<button id='sq"+i+"' class='btn btn-primary btn-viewques'>查看" +
                        "<div class='view-ques' style='display:none'> " + 
                            info[i].Qid+"###"+info[i].Qcontent+"###"+info[i].QChoice+"###"+info[i].QAnswer + 
                        "</div>" +
                    "</button> &nbsp;" + 
                    "<button id='DEL"+info[i].Qid+"'class='btn btn-warning btn-primary btn-delete-from-set' name='delete'>删除</button>" +
                    "</td>";
        
        html += '</tr>';
    }
    $('#Ques_List').html(html);

    $(".btn-delete-from-set").on('click',function(){
        console.log("click Delete...");
        if($("#choose_set").val()=='-1')
        {
            /// 从总题库中删除题目，同时删除所有相关表中的数据
            Delete_From_Question($(this).attr('id').replace(/DEL/,""));
        }else{
            /// 只从题组中移除此题，并删除已存在的考试记录
            Delete_From_Set($("#choose_set").find("option:selected").val(),$(this).attr('id').replace(/DEL/,""));
        }
    });
    
    //console.log(html);
    //console.log(info['sql']);

    $('.btn-viewques').on('click',function(){
        //"3###以下哪些是浏览器？？             ###Chrome@IE@VS@Firefox@###0,1,3,###0,1,3,";

        var Q = $(this).children('.view-ques').text();
        var Q_id = "Q" + Q.split("###")[0];
        //console.log(Q_id);
        var QC = Q.split("###")[1] + "<br>";

        var QCho = Q.split("###")[2];
        var QChoReal = QCho.split('@');
        var QputCho = "";
        for(var i=0;i<QChoReal.length-1;i++){
            QputCho += "(";
            QputCho += parseInt(i)+1;
            QputCho += ")";
            QputCho += QChoReal[i];
            QputCho += " <br>";
        }

        var QAn = Q.split("###")[3];
        var QAnswerReal = QAn.split(',');
        var QputAnswer = "正确答案：";
        for(var k=0;k<QAnswerReal.length-1;k++){
            QputAnswer += "(";
            QputAnswer += parseInt(QAnswerReal[k])+1;
            QputAnswer += ")";
        }
        QputAnswer += " <br>";

        QAll = QC + QputCho + QputAnswer;

        dialog.tip(Q_id,QAll);
    })

    var pages = Math.ceil(total_Ques / 5);
    totalPages_Ques = pages;
    $('#totalPages_Ques').val(totalPages_Ques);//把总页数存到隐藏框里   
    var dangqian = currentPage_Ques ? parseInt(currentPage_Ques) : 1; //当前页数   
    $('#currentPage_Ques').val(dangqian);//把当前页存放到隐藏框
    var j = 0;
    var s = '<nav class="page_Ques" aria-label="Page navigation"><ul class="pagination"><li><a id="first_Ques">首页</a></li>';
    if (dangqian != 1) {
        s += '<li><a id="down_Ques">上一页</a></li>';
    }
    for (var i = dangqian - 2; i <= dangqian + 2; i++) {
        if (j == 5) {//页码列表只显示3列，即只显示1、2、3或2、3、4这样的三列，以此类推。
            break;
        } else {
            j++;
        }
        if (i > 0 && i <= pages) {
            if (dangqian == i) {
                s += '<li class="thisclass"><a class="current_Ques center_Ques">' + i + '</a></li>';
            }
            else {
                s += '<li><a class="center_Ques">' + i + '</a></li>';
            }
        }
    }
    if (dangqian != totalPages_Ques) {
        s += '<li><a id="up_Ques">下一页</a></li>';
    }
    s += '<li><a id="last_Ques">末页</a></li>';
    s += '<li><span class="pageinfo">共 <strong>' + totalPages_Ques + '</strong>页<strong>' + total_Ques + '</strong>条</span></li></ul></nav>';
    $(".list-div-Ques").html(s);

    //给分页列表绑定事件
    bindingEvent_Ques();
}
           