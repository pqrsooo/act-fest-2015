// JavaScript Document
var $recheckBtn = $('#recheck_btn');

var checkStudentInfo = function() {
  $recheckBtn.attr('disabled', true);
  var studentIDVal = $('#studentID').val();
  $recheckBtn.html('<img src="imgs/loading-bubbles.svg" alt=""/> กำลังตรวจสอบข้อมูล');

  Parse.initialize("S5buqd8nX0HvrNNQ5w2ZRk69LNzJNMOe2mCdyycR", "cYbVSxPhYXVulG086z8VyVlpsNbYsqy1CDvcl6YE");
  var Attendant = Parse.Object.extend("Attendant");
  var attendant = new Attendant();
  attendant.save({studentID: studentIDVal}).then(function(object) {
    $recheckBtn.attr('disabled', false);
    $recheckBtn.html("ยืนยัน");
    $('#studentID').val("");
  });
};

$('#studentID').on('keypress', function(evt) {
  if (evt.which === 13) {
    evt.stopPropagation();
    checkStudentInfo();
    return false;
  }
});

$recheckBtn.click(checkStudentInfo);


$(function() {
  /*var $recheckBtn = $('#recheck_btn');
  var loadingHtml = '<br><p class="loading-text text-center"><img src="imgs/loading-bubbles.svg" alt=""/> กรุณารอสักครู่...</p>';

  var connErrorHtml = '<h2 class="error-msg"><span class="icon-error" style="font-family: ' + 'fontello' + '; font-size: 25px;">&#xe810;</span> มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของท่าน และลองใหม่อีกครั้ง</h2>';
  var dataErrorHtml = {
    '-1': '<h2 class="error-msg"><span class="icon-error" style="font-family: ' + 'fontello' + '; font-size: 25px;">&#xe810;</span> มีปัญหาเกิดขึ้นบนเซิร์ฟเวอร์ กรุณาติดต่อทีมงาน</h2><p class="error-code">รหัสข้อผิดพลาด: -1</p>',
    0: '<h2 class="error-msg"><span class="icon-error" style="font-family: ' + 'fontello' + '; font-size: 25px;">&#xe810;</span> ไม่พบข้อมูลในระบบ</h2><p class="error-code">รหัสข้อผิดพลาด: 0</p>',
    1: '<h2 class="error-msg"><span class="icon-error" style="font-family: ' + 'fontello' + '; font-size: 25px;">&#xe810;</span> ข้อมูลที่พบไม่สมบูรณ์ กรุณาแจ้งรหัสข้อผิดพลาดทีมงาน<h2><p class="error-code">รหัสข้อผิดพลาด: 1</p>',
    2: '<h2 class="error-msg"><span class="icon-error" style="font-family: ' + 'fontello' + '; font-size: 25px;">&#xe810;</span> ข้อมูลที่พบไม่สมบูรณ์ กรุณาแจ้งรหัสข้อผิดพลาดทีมงาน</h2><p class="error-code">รหัสข้อผิดพลาด: 2</p>',
    3: '<h2 class="error-msg"><span class="icon-error" style="font-family: ' + 'fontello' + '; font-size: 25px;">&#xe810;</span> ระบบบันทึกข้อมูลผิดพลาด กรุณาแจ้งรหัสข้อผิดพลาดทีมงาน</h2><p class="error-code">รหัสข้อผิดพลาด: 3</p>'
  };
  var studentNoteData = {
    PICTURE_NOT_SUBMITTED: 'ยังไม่ส่งรูป'
  };

  function loadStudentInfoDataError(jqXHR, textStatus) {
    $('#recheck_info').html(connErrorHtml);
  }

  function generatePersonHtml(person) {
    var str = '<div class="person-info">';

    str += '<div class="row"><div class="col-xs-5 col-sm-5 person-info-header">ชื่อ</div>';
    str += '<div class="col-xs-7 col-sm-7 text-left border-l">' + person.prefix + ' ' + person.name + '&nbsp;&nbsp;' + person.surname + '</div></div>';

    str += '<div class="row person-info-alt"><div class="col-xs-5 col-sm-5 person-info-header ">ชื่อเล่น</div>';
    str += '<div class="col-xs-7 col-sm-7 text-left border-l">' + person.nickname + '</div></div>';

    str += '<div class="row"><div class="col-xs-5 col-sm-5 person-info-header">คณะ / สำนักวิชา</div>';
    str += '<div class="col-xs-7 col-sm-7 text-left border-l">' + person.faculty + '</div></div>';

    str += '<div class="row person-info-alt"><div class="col-xs-5 col-sm-5 person-info-header">รหัสประจำตัวประชาชน หรือ Passport</div>';
    str += '<div class="col-xs-7 col-sm-7 text-left border-l">' + person.nationalID + '</div></div>';

    str += '<div class="row"><div class="col-xs-5 col-sm-5 person-info-header">ต้องการพักที่หอพักนิสิตจุฬาฯ?</div>';
    str += '<div class="col-xs-7 col-sm-7 text-left border-l">' + (person.needRest === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ') + '</div></div>';

    if (person.note !== null && person.note !== undefined) {
      str += '<div class="row person-info-alt"><div class="col-xs-5 col-sm-5 person-info-header">ข้อมูลเพิ่มเติม</div>';
      str += '<div class="col-xs-7 col-sm-7 text-left border-l">' + studentNoteData[person.note] + '</div></div>';
    }

    str += '</div>';

    return str;
  }

  function loadStudentInfoDataSuccess(data, textStatus) {

    if (data.status === 'ok') {
      var htmlStr = '<div class="row" style="margin-top:10px;"><div class="col-xs-12 col-md-6 col-lg-5">';
      htmlStr += '<img style="max-height: 250px;" src="' + data.baanImgURL + '" alt="' + data.baanName + '">';
      htmlStr += '<p style="font-size: 40px;">' + data.baanName + '</p>';
      htmlStr += '</div>';

      // Person info

      htmlStr += '<div class="col-xs-12 col-md-6 col-lg-7"><div style="font-size: 25px; text-align: center; margin-top: 30px; margin-bottom: 5px;"><b>ข้อมูลของน้อง</b></div>';

      htmlStr += generatePersonHtml(data.me);

      htmlStr += '</div></div>';

      $('#recheck_info').html(htmlStr);
    } else {
      $('#recheck_info').html(dataErrorHtml[data.errorCode]);
    }
  }

  // Called on AJAX's success or error
  function loadStudentInfoDataComplete() {
    $recheckBtn.removeAttr('disabled');
    $('#recheck_info').hide().fadeIn(500);
  }

  $('#nationalID').on('keypress', function(evt) {
    if (evt.which === 13) {
      evt.stopPropagation();
      checkStudentInfo();
      return false;
    }
  });

  var checkStudentInfo = function() {
    $recheckBtn.attr('disabled', true);
    $('#recheck_info_container').show();
    $('#recheck_info').html(loadingHtml);

    var nationalIDVal = $('#nationalID').val().replace(/\s/g, '').replace(/-/g, '');
    var sentData = { nationalID: nationalIDVal };
    $('#nationalID').val(nationalIDVal);

    $.ajax({
      type: 'POST',
      data: JSON.stringify(sentData),
      contentType: 'application/json',
      url: 'rest/checkinfo',
      dataType: 'json',
      cache: false,
      success: loadStudentInfoDataSuccess,
      error: loadStudentInfoDataError,
      complete: loadStudentInfoDataComplete
    });
  };

  $recheckBtn.click(checkStudentInfo);*/

});
