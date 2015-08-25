/* global countdownTimeLeft, TweenLite, Quad */

var bumpIt = function() {
  if ($(window).width() < 751) {
    $('.main-section').css('margin-top', $('.header-sm-xs').height());
  } else {
    $('.main-section').css('margin-top', $('.header').height());
  }
};

window.onload = bumpIt;

// JavaScript Document
$(function() {

  var resizeDebouncer = {
    timer: null,

    callback: function() {
      resizeDebouncer.timer = null;
      bumpIt();
    },

    fireResize: function() {
      if (resizeDebouncer.timer === null) {
        resizeDebouncer.timer = setTimeout(resizeDebouncer.callback, 250);
      }
    }
  };

  $(window).resize(resizeDebouncer.fireResize);
  bumpIt();

  /* $("img.load-img").on("load",function(){
    bumpIt();
  }); */

  var headerUpdater = (function() {
    var obj = {};
    var $window = $(window);
    var isMenubarExpanded = true;

    obj.update = function() {
      var ss = $window.scrollTop();
      if (ss >= $('.header').height()) {
        if (isMenubarExpanded) {
          isMenubarExpanded = false;
          TweenLite.to('.header', 0.4, {scaleY: 0.85, backgroundColor: 'rgba(255, 255, 255, 0.95)', transformOrigin: '50% 0%', ease: Quad.easeOut});
          TweenLite.to('.header img', 0.4, {scaleX: 0.85, transformOrigin: '0% 0%', ease: Quad.easeOut});
          TweenLite.to('.header ul', 0.4, {scaleX: 0.85, transformOrigin: '100% 0%', ease: Quad.easeOut});
        }
      } else if (ss === 0) {
        if (!isMenubarExpanded) {
          isMenubarExpanded = true;
          TweenLite.to('.header', 0.2, {scaleY: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)', transformOrigin: '50% 0%', ease: Quad.easeOut});
          TweenLite.to('.header img', 0.2, {scaleX: 1, transformOrigin: '0% 0%', ease: Quad.easeOut});
          TweenLite.to('.header ul', 0.2, {scaleX: 1, transformOrigin: '100% 0%', ease: Quad.easeOut});
        }
      }
    };

    obj.init = function() {
      obj.update();
      $window.scroll(obj.update).resize(obj.update);
    };

    return obj;
  })().init();

  $('.footer').on('mouseover', '.social', function() {
    var color = $(this).data('color');
    TweenLite.to($(this), 0.3, {alpha: 1, color: color});
  }).on('mouseout', '.social', function() {
    TweenLite.to($(this), 0.3, {alpha: 0.5, color: 'rgba(0, 0, 0, 1)'});
  });

  $('#baanlist_show_button').on('mouseover', function() {
    TweenLite.to($(this), 0.2, {backgroundColor: 'rgba(241, 95, 151, 1)', color: 'rgba(255, 255, 255, 1)'});
  }).on('mouseout', function() {
    TweenLite.to($(this), 0.2, {backgroundColor: 'rgba(241, 95, 151, 0)', color: 'rgba(241, 95, 151, 1)'});
  });

  $('#baan_data').on('mouseover', '.card', function() {
    TweenLite.to($(this).find('.screen'), 0.4, {alpha: 1});
    TweenLite.to($(this).find('.img'), 0.4, {scale: 1.1, transformOrigin: '50% 50%'});
  }).on('mouseout', '.card', function() {
    TweenLite.to($(this).find('.screen'), 0.4, {alpha: 0});
    TweenLite.to($(this).find('.img'), 0.4, {scale: 1, transformOrigin: '50% 50%'});
  });

  $('.header').on('click', '.home-logo', function() {
    $('body,html').animate({
      scrollTop: 0
    }, 350);
  }).on('click', '.m-1', function() {
    $('body,html').animate({
      scrollTop: $('#result_section').offset().top - $('.header').height() * 0.8 + 60
    }, 350);
  }).on('click', '.m-2', function() {
    $('body,html').animate({
      scrollTop: $('#baanlist_section').offset().top - $('.header').height() * 0.8 + 60
    }, 350);
  });

  /*function loadBaanList() {
    $.getJSON('./rest/baanData')
    .done(function(resp) {
      if (resp.status === 'error') {
        $('#baan_data').html('<p class="loading-text text-center">ระบบไม่สามารถดึงข้อมูลบ้านได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง ขออภัยในความไม่สะดวก</p>');
      } else {
        var txt = '';
        var ROOT_IMG_BAAN = resp.config.root;
        var EXTENSION_IMG_BAAN = resp.config.extension;
        var len = resp.data.length;
        var i;
        var tmp;

        for (i = 0; i < len; i++) {
          var j = Math.floor(Math.random() * len);
          tmp = resp.data[i];
          resp.data[i] = resp.data[j];
          resp.data[j] = tmp;
        }

        var categories = {
          S: [],
          M: [],
          L: [],
          XL: []
        };

        for (i = 0; i < len; i++) {
          categories[resp.data[i].size].push(resp.data[i]);
        }

        for (var size in categories) {

          if (!categories.hasOwnProperty(size)) continue;

          txt += '<div style="text-align:center; margin:20px 0; font-size:28px; font-weight: bold;">ไซส์ <span style="font-size:36px;">' + size + '</span></div>';
          txt += '<div class="section-header-seperator"></div>';
          txt += '<div class="wrap-card text-center">';
          for (i = 0; i < len; i++) {
            var each = resp.data[i];

            if (each.size !== size) continue;

            // For Large Screen
            txt += '<div class="card hidden-xs hidden-sm">';
            if (each.link.length > 0) txt += '<a href="' + each.link + '" target="_blank">';
            txt +=
              '<div class="screen text-left">' +
                '<div class="wrap-card-data">' +
                  '<div class="row">' +
                    '<span class="text-bold" style="font-size: 24px; color: #414141;">' + each.name + '</span>' +
                  '</div>' +
                  '<div class="row" style="margin: 2px 0 0 0;">' +
                    '<div class="col-md-12" style="width: 140px; left: 50%; margin: 0 0 0 -70px; height: 1px; background: #414141;"></div>' +
                  '</div>' +
                  '<div class="row" style="margin: 5px 0 0 0;">' +
                    '<span style="font-family: ' + '\'fontello\'' + '; font-size: 16px; color: rgba(196, 0, 0, 1);">&#xe801;</span><br><span style="color: rgba(196, 0, 0, 1);">' + each.size + '</span><br>' +
                    '<span style="font-family: ' + '\'fontello\'' + '; font-size: 16px; color: rgba(59, 89, 153, 1);">&#xe802;</span><br><span style="color: rgba(59, 89, 153, 1);">' + each.fb_profile + '</span>' +
                  '</div>' +
                '</div>' +
              '</div>';
            if (each.link.length > 0) txt += '</a>';
            txt += '<div class="img"><img class="img-responsive" src="' + ROOT_IMG_BAAN + each.id + EXTENSION_IMG_BAAN + '"></div>' +
              '</div>';

            // For Small Screen
            txt += '<div class="card-sm-xs hidden-md hidden-lg">';
            if (each.link.length > 0) txt += '<a href="' + each.link + '" target="_blank">';
            txt +=
              '<div class="img-sm-xs"><img class="img-responsive" src="' + ROOT_IMG_BAAN + each.id + EXTENSION_IMG_BAAN + '"></div>' +
              '<div class="screen-sm-xs text-center">' +
                '<div class="wrap-card-data-sm-xs">' +
                  '<div class="row">' +
                    '<span class="text-bold" style="font-size: 20px; color: #414141;">' + each.name + '</span>' +
                  '</div>' +
                  '<div class="row" style="margin: 2px 0 0 0;">' +
                    '<div class="col-md-12" style="width: 140px; left: 50%; margin: 0 0 0 -70px; height: 1px; background: #414141;"></div>' +
                  '</div>' +
                  '<div class="row" style="margin: 5px 0 0 0; width: 200px;">' +
                    '<span style="font-family: ' + '\'fontello\'' + '; font-size: 16px; color: rgba(196, 0, 0, 1);">&#xe801;</span> <span style="color: rgba(196, 0, 0, 1);">' + each.size + '</span> &middot;' +
                    '<span style="font-family: ' + '\'fontello\'' + '; font-size: 16px; color: rgba(59, 89, 153, 1);">&#xe802;</span> <span style="color: rgba(59, 89, 153, 1);">' + each.fb_profile + '</span>' +
                  '</div>' +
                '</div>' +
              '</div>';
            if (each.link.length > 0) txt += '</a>';
            txt += '</div>';
          }

          txt += '</div>';
        }

        $('#baan_data').html(txt);
      }
    }).fail(function() {
      $('#baan_data').html('<p class="loading-text text-center">ระบบไม่สามารถดึงข้อมูลบ้านได้ในขณะนี้ การเชื่อมต่ออินเทอร์เน็ตอาจจะขัดข้อง หรือเซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่อีกครั้งในภายหลัง</p>');
    });
  }

  $('#baanlist_show_button').click(function() {
    $('#baanlist_show_button').hide();
    $('#baanlist_placeholder').show();
    loadBaanList();
  });*/

  // Student info checking

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
