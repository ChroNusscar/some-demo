/*
 *用户中心
 *引用 require('config')('user', '用户中心');
 *必须操作
 *
 *updata 2015.08.25 sanmiao
 */
define(function(require, exports, module) {
	var site = require('config')('user', '收款明细');
	if (!site.userInfo.isLogin) {
		window.location.href = '/mobile/login.html';
	}
	//获取状态
	var status = site.getParam('status'), //状态
		nav = $('#nav'),
		list = $('#list'),
		moreBtn = $('#moreBtn'),
		pageNumber = 1, //当前第x页
		totalPage = 2; //总页
	if (status) {
		nav.find('a[alias="' + status + '"]').addClass('active');
	} else {
		status = nav.find('a').eq(0).addClass('active').attr('alias');
	}
	//获取数据
	function getDate(pageNumber) {
		$.showPreloader();
		site.ajax({
			url: '/app/payDetail.htm',
			data: {
				pageNumber: pageNumber,
				pageSize: 10,
				status: status
			},
			success: function(res) {
				$.hidePreloader();
				if (res.code === 1) {
					res.status = status;
					totalPage = res.totalPage;
					if (pageNumber >= totalPage) {
						moreBtn.addClass('fn-hide');
					} else {
						moreBtn.removeClass('ing');
					}
					if (pageNumber === 1) {
						list.html(template('t-list', res));
					} else {
						list.append(template('t-list', res));
					}
				} else {
					$.alert('未能查找到~', '提示');
				}
			}
		});
	}
	moreBtn.on('click', function() {
		var _this = $(this);
		if (_this.hasClass('ing')) {
			return;
		}
		_this.addClass('ing');
		getDate(++pageNumber);
	});
	getDate(pageNumber);
});