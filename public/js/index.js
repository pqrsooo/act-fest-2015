// JavaScript Document
var $recheckBtn = $('#recheck_btn');
var noti = false;

$('input').focus();

var clearForm = function() {
  $recheckBtn.attr('disabled', false);
  $recheckBtn.html("ลงทะเบียน");
  $('#studentID').val("");
};

var saveData = function(Attendant, studentIDVal) {
  var attendant = new Attendant();
  attendant.save({studentID: studentIDVal}).then(function(object) {
    clearForm();
    $('.noti-box').css('color', '#23b574');
    $('.noti-box').css('border-color', '#23b574');
    $('.noti-box').html('<span class="icon-ok" style="font-family:'+ 'fontello'+'; font-size: 25px;">&#xe802;</span><br>ลงทะเบียนเรียบร้อย<br>รหัสประจำตัวนิสิต <b>'+studentIDVal+'</b>');
    $('#recheck_info_container').slideDown(300);
    noti = true;
  });
}

var checkStudentInfo = function() {
  $recheckBtn.attr('disabled', true);
  var studentIDVal = $('#studentID').val();
  $recheckBtn.html('<img src="imgs/loading-bubbles.svg" alt=""/> กำลังตรวจสอบข้อมูล');

  var numberReg = /^\d+$/;

  if(studentIDVal.length==10 && numberReg.test(studentIDVal)) {
    Parse.initialize("S5buqd8nX0HvrNNQ5w2ZRk69LNzJNMOe2mCdyycR", "cYbVSxPhYXVulG086z8VyVlpsNbYsqy1CDvcl6YE");
    var Attendant = Parse.Object.extend("Attendant");
    var query = new Parse.Query(Attendant);

    query.equalTo("studentID", studentIDVal);
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " record(s).");

        if(results.length > 0) {
          moment.locale('th');
          $('.noti-box').css('color', '#ea4434');
          $('.noti-box').css('border-color', '#ea4434');
          $('.noti-box').html('<span class="icon-error" style="font-family:'+ 'fontello'+'; font-size: 25px;">&#xe800;</span><br>พบรหัสประจำตัวนิสิต <b>'+studentIDVal+'</b> ในระบบ<br>ลงทะเบียนครั้งล่าสุด เมื่อวันที่ <b>'+moment(results[0].createdAt).format("DD MMMM YYYY hh:mm:ss")+' น. ('+moment(results[0].createdAt).fromNow()+')</b>');
          $('#recheck_info_container').slideDown(300);
          noti = true;

          var attendant = new Attendant();
          attendant.save({studentID: studentIDVal}).then(function(object) {
            clearForm();
          });
        }
        else {
          saveData(Attendant, studentIDVal);
        }
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
        $('.noti-box').css('color', '#ea4434');
        $('.noti-box').css('border-color', '#ea4434');
        $('.noti-box').html('<span class="icon-error" style="font-family:'+ 'fontello'+'; font-size: 25px;">&#xe800;</span><br>มีปัญหาในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของท่าน');
        $('#recheck_info_container').slideDown(300);
        noti = true;

        clearForm();
      }
    });
  }
  else {
    $('.noti-box').css('color', '#ea4434');
    $('.noti-box').css('border-color', '#ea4434');
    $('.noti-box').html('<span class="icon-error" style="font-family:'+ 'fontello'+'; font-size: 25px;">&#xe800;</span><br>รหัสประจำตัวนิสิตไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    $('#recheck_info_container').slideDown(300);
    noti = true;

    clearForm();
  }
};

$('#studentID').on('keypress', function(evt) {
  if(noti == true) {
    $('#recheck_info_container').slideUp(300);
    noti = false;
  }
  if (evt.which === 13) {
    evt.stopPropagation();
    checkStudentInfo();
    return false;
  }
});

$recheckBtn.click(checkStudentInfo);

$(function() {
});
