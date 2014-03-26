//主要用于监听退出按钮
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
	// Register the event listener
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown(){
	navigator.notification.confirm("是否退出记事本", confirmMsg, "退出程序", "确认,取消");

}
function exitApp() {
	navigator.app.exitApp();
}
function confirmMsg(button){  
	if(button == 1){
		exitApp();
	}
}
//首页页面创建事件
$('#notePage').on('pagecreate', function(event){
	//if(getData('NOTENAV') == null){
		//window.location.href = "notenav.html";
	//}else{
		var listview = $(this).find('ul[data-role="listview"]');
		var strHTML = "";
		var m = 0;
		var n = 0;
		for (var intI = 0; intI < storage.length; intI++) {
			strKey = storage.key(intI);
			if (strKey.substring(0, 4) == "note") {
				var getContent = JSON.parse(getData(strKey));
				if (getContent.type == "a") {
					m++;
				}
				if (getContent.type == "b") {
					n++;
				} 
			}
		}
		var sum = parseInt(m) + parseInt(n); 
    
		strHTML += '<li data-role="list-divider" style="background-color:#7299c2; color:#F8FFFF;font-family: Helvetica,Arial,sans-serif;font-weight: bold; font-size: 20px;">全部记事本内容<span class="ui-li-count">' + sum + '</span></li>';
		strHTML += '<li><a href="notelist.html" data-ajax="false" data-id="a" data-name="散文">散文<span class="ui-li-count">' + m + '</span></a></li>';
		strHTML += '<li><a href="notelist.html" data-ajax="false" data-id="b" data-name="随笔">随笔<span class="ui-li-count">' + n + '</span></a></li>';
		listview.html(strHTML);
		listview.listview('refresh');  
		listview.delegate('li a', 'click', function(e) {
			setData('link_type', $(this).data('id'))
			setData('type_name', $(this).data('name'))
		});
	//}
});


//记事列表页面创建事件
$("#listPage").on("pagecreate", function() {
    var listview = $(this).find('ul[data-role="listview"]');
    var strKey = "";
	var strHTML = "";
	var intSum = 0;
    var strType = getData('link_type');
    var strName = getData('type_name');
    for (var intI = 0; intI < storage.length; intI++) {
        strKey = storage.key(intI);
        if (strKey.substring(0, 4) == "note") {
            var getContent = JSON.parse(getData(strKey));
            if (getContent.type == strType) {
                strHTML += '<li data-icon="false" ><a data-ajax="false" href="notedetail.html" data-id="' + getContent.nid + '">' + getContent.title + '</a></li>';
                intSum++;
            } 
        }
    }
    var strTitle = '<li data-role="list-divider" style="background-color:#7299c2; color:#F8FFFF;font-family: Helvetica,Arial,sans-serif;font-weight: bold; font-size: 20px;">' + strName + '<span class="ui-li-count">' + intSum + '</span></li>';
    listview.html(strTitle + strHTML);
	listview.listview('refresh'); 
    listview.delegate('li a', 'click', function(e) {
        setData('list_link_id', $(this).data('id'))
    });
});

//增加记事页面创建事件
$("#addPage").on("pagecreate", function() {
    var header = $(this).find('div[data-role="header"]');
    var rdotype = $("input[type='radio']");
    var hidtype = $("#hidtype");
    var txttitle = $("#txt-title");
    var txtacontent = $("#txta-content");
	//选择不同类型，把值存储到hidden input 里面去
    rdotype.bind("change", function() {
        hidtype.val(this.value);
    });
	//保存按钮的时候，处理的函数 
    header.delegate('a', 'click', function(e) {
        if (txttitle.val().length > 0 && txtacontent.val().length > 0) {
            var strnid = "note_" + RetRndNum(3);
            var noteData = new Object;
            noteData.nid = strnid;
            noteData.type = hidtype.val();
            noteData.title = txttitle.val();
            noteData.content = txtacontent.val();
            var jsonNoteData = JSON.stringify(noteData);
            setData(strnid, jsonNoteData);
            window.location.href = "notelist.html";
        }
    });
    function RetRndNum(n) {
        var strRnd = "";
        for (var intI = 0; intI < n; intI++) {
			//floor()表示四舍五入，random()产生0～1的随机数
            strRnd += Math.floor(Math.random() * 10);
        }
        return strRnd;
    }
});

//修改记事页面创建事件
$("#editPage").on("pagebeforeshow", function() {
    var strId = getData('list_link_id');
    var header = $(this).find('div[data-role="header"]');
    var rdotype = $("input[type='radio']");
    var hidtype = $("#hidtype");
    var txttitle = $("#txt-title");
    var txtacontent = $("#txta-content");
    var editData = JSON.parse(getData(strId));
    hidtype.val(editData.type);
    txttitle.val(editData.title);
    txtacontent.val(editData.content);
    if (editData.type == "a") {
        $("#lbl-type-0").removeClass("ui-radio-off").addClass("ui-radio-on ui-btn-active");
    } else {
        $("#lbl-type-1").removeClass("ui-radio-off").addClass("ui-radio-on ui-btn-active");
    }
	//修改的事件
    rdotype.bind("change", function() {
        hidtype.val(this.value);
    });
    header.delegate('a', 'click', function(e) {
        if (txttitle.val().length > 0 && txtacontent.val().length > 0) {
            var strnid = strId;
            var noteData = new Object;
            noteData.nid = strnid;
            noteData.type = hidtype.val();
            noteData.title = txttitle.val();
            noteData.content = txtacontent.val();
            var jsonNoteData = JSON.stringify(noteData);
            setData(strnid, jsonNoteData);
            window.location.href = "notelist.html";
        }
    })
});


//记事详细页面创建事件
$("#detailPage").on("pagecreate", function() {
    var type = $(this).find('div[data-role="header"] h4');
    var strId = getData('list_link_id');
    var titile = $("#title");
    var content = $("#content");
    var listData = JSON.parse(getData(strId));
    var strType = listData.type == "a" ? "散文" : "随笔";
    type.html(strType);
    titile.html(listData.title);
    content.html(listData.content);
    $(this).delegate('#alink_delete', 'click', function(e) {
        var yn = confirm("您真的要删除吗？");
        if (yn) {
            removeData(strId);
            window.location.href = "notelist.html";
        }
    })
});


