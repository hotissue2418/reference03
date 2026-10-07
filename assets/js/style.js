/* ==========================================================
 * Common UI
 * 공통 UI 동작 : TOP 버튼, 우측 메뉴 hover, 전화번호 복사, 빠른상담 패널
 * ========================================================== */
$(function(){
	imgFallbackAction();
	topBtnAction();
	sideMenuAction();
	phoneCopyAction();
	quickConsultAction();
	mobileHeaderAction();
	subMenuAction();
	globalPopupAction();
});

/* 이미지 대체 : 실제 이미지 파일이 없으면 data-fallback 의 자리표시자로 교체 */
function imgFallbackAction(){
	$("img[data-fallback]").each(function(){
		const img = this;

		function setFallback(){
			const fb = img.getAttribute("data-fallback");

			img.removeAttribute("data-fallback");
			img.src = fb;
		}

		$(img).one("error", setFallback);

		if(img.complete && img.naturalWidth === 0){
			setFallback();
		}
	});
}

/* TOP 버튼 : 스크롤 300px 이후 노출 */
function topBtnAction(){
	const $topBtn = $("#TOP_BTN");

	if(!$topBtn.length) return;

	$(window).on("scroll", function(){
		$topBtn.toggleClass("on", $(window).scrollTop() > 300);
	});

	$topBtn.on("click", function(){
		$("html, body").stop().animate({scrollTop:0}, 500);
	});
}

/* 우측 메뉴 : hover 한 블롭은 .active, 인접 블롭은 .nothover (data-no 는 블롭 고유 번호) */
function sideMenuAction(){
	const $items = $(".circle-list .circle-item"),
		nearMap = {
			1:[2,3],
			2:[1,3],
			3:[1,2,8],
			4:[2,3,5,7],
			5:[4,6],
			6:[5,7],
			7:[6],
			8:[3]
		};

	if(!$items.length) return;

	$items.find(".shape").on("mouseover", function(){
		const $item = $(this).closest(".circle-item"),
			no = Number($item.attr("data-no"));

		$items.removeClass("active nothover");
		$item.addClass("active");
		$item.find(".gnb-sub-wrap").css("opacity", 1);

		$.each(nearMap[no] || [], function(_, n){
			$items.filter("[data-no='" + n + "']").addClass("nothover");
		});
	});

	$items.on("mouseleave", function(){
		$items.removeClass("active nothover");
		$items.find(".gnb-sub-wrap").css("opacity", 0);
	});
}

/* 좌측 전화번호 클릭 시 복사 */
function phoneCopyAction(){
	const $tel = $(".side-panel-left .tel");

	if(!$tel.length || !navigator.clipboard) return;

	$tel.on("click", function(){
		const num = $(this).attr("data-clipboard-text");

		navigator.clipboard.writeText(num).then(function(){
			alert("전화번호가 복사되었습니다.\n" + num);
		});
	});
}

/* 빠른상담 슬라이드 패널 : 퀵메뉴 '빠른상담' 으로 열고 × 로 닫음, 연락처 자동 하이픈, 입력 검증 */
function quickConsultAction(){
	const $panel = $("#QUICK_CONSULT"),
		$name = $("#QUICK_NAME"),
		$cp = $("#QUICK_CP"),
		$agree = $("#QUICK_AGREE");

	if(!$panel.length) return;

	function phoneFormat(num){
		const n = num.replace(/[^0-9]/g, "");

		if(n.length < 4) return n;
		if(n.length < 8) return n.replace(/(\d{3})(\d+)/, "$1-$2");
		return n.replace(/(\d{3})(\d{3,4})(\d{0,4}).*/, "$1-$2-$3").replace(/-$/, "");
	}

	$("#COUNSEL_GO").on("click", function(){
		$panel.addClass("on");
	});

	$("#QUICK_CONSULT_CLOSE").on("click", function(){
		$panel.removeClass("on");
	});

	$cp.on("input", function(){
		$(this).val(phoneFormat($(this).val()));
	});

	$("#QUICK_SUBMIT").on("click", function(){
		if(!$.trim($name.val())){
			alert("성함을 입력해 주세요.");
			$name.focus();
			return;
		}

		if($cp.val().replace(/-/g, "").length < 10){
			alert("휴대폰 번호를 정확히 입력해 주세요.");
			$cp.focus();
			return;
		}

		if(!$agree.is(":checked")){
			alert("개인정보 수집사용에 동의해 주세요.");
			return;
		}

		/* TODO: 상담 신청 API 연동 */
		alert("상담 신청이 접수되었습니다.");
		$name.add($cp).val("");
		$agree.prop("checked", false);
		$panel.removeClass("on");
	});
}

/* 글로벌 언어 선택 원형 메뉴 : 퀵바 '글로벌' 로 열고 X 로 닫음 */
function globalPopupAction(){
	const $popup = $("#GLOBAL_POPUP");

	if(!$popup.length) return;

	$("#GLOBAL_ROTATE_LOGO").on("click", function(){
		$popup.addClass("active");
	});

	$("#GLOBAL_POPUP_CLOSE").on("click", function(){
		$popup.removeClass("active");
	});
}

/* 서브 탭메뉴 : 아래로 스크롤하면 접고(.none), 위로 올리거나 최상단이면 다시 펼침 */
function subMenuAction(){
	const $subMenu = $("#HEADER_SUB_MENU_AREA");

	if(!$subMenu.length) return;

	let lastTop = $(window).scrollTop();

	$(window).on("scroll", function(){
		const top = $(window).scrollTop();

		if(top <= 0 || top < lastTop){
			$subMenu.removeClass("none");
		}else if(top > lastTop){
			$subMenu.addClass("none");
		}

		lastTop = top;
	});
}

/* 모바일/태블릿 헤더 : 전체 메뉴 토글, 아코디언, 슬라이드 배너(자동재생 + 진행바), 배너 닫기 */
function mobileHeaderAction(){
	const $menuBtn = $("#HEADER_MENU_BTN, #HEADER_MENU_BTN_PC"),
		$menuArea = $("#HEADER_MENU_AREA"),
		$banner = $("#SWIPER_MO_HEADER_BANNER");

	if(!$menuBtn.length) return;

	const $menuBg = $("#SUB_MENU_BG"),
		$menuItems = $menuArea.find(".depth01-item");

	/* 전체 메뉴 열기/닫기 : 열고 닫을 때마다 펼침 상태와 오버레이를 초기화, 열려 있는 동안 본문 스크롤 잠금 */
	$menuBtn.on("click", function(){
		const isOn = !$menuArea.hasClass("on");

		$menuBtn.toggleClass("on", isOn);
		$menuArea.toggleClass("on", isOn);
		$menuItems.removeClass("select");
		$menuBg.removeClass("on");
		$("body").toggleClass("lock", isOn);
	});

	/* 대메뉴 아코디언 : 항목을 누르면 흰 반투명 오버레이를 깔고 해당 항목만 펼침/접힘 */
	$menuItems.on("click", function(){
		$menuBg.addClass("on");
		$(this).siblings().removeClass("select");
		$(this).toggleClass("select");
	});

	if(!$banner.length) return;

	/* 배너 : 세션 중 한 번 닫으면 다시 노출하지 않음 */
	try{
		if(sessionStorage.getItem("headerBanner")){
			$banner.addClass("closed");
			$("body").addClass("banner-closed");
		}
	}catch(e){}

	$banner.find(".banner-close").on("click", function(){
		$banner.addClass("closed");
		$("body").addClass("banner-closed");

		try{
			sessionStorage.setItem("headerBanner", "true");
		}catch(e){}
	});

	if(typeof Swiper === "undefined") return;

	const bar = $banner.find(".progress-bar")[0],
		slideCount = $banner.find(".swiper-slide").length;

	/* 진행바 : 슬라이드 전환 시작 시 0% 로 즉시 리셋, 전환이 끝나면 3초 동안 100% 로 채움 */
	function resetProgressBar(){
		bar.style.transition = "none";
		bar.style.width = "0%";
	}

	function startProgressBar(){
		resetProgressBar();

		/* 0% 상태를 먼저 확정(강제 리플로우)해야 transition 이 걸린다. 없으면 첫 실행에서 바로 100% 로 점프해 멈춘 것처럼 보임 */
		void bar.offsetWidth;

		bar.style.transition = "width 3s linear";
		bar.style.width = "100%";
	}

	/* 첫 시작 : 배너가 화면에 노출될 때부터 진행바 시작 (IntersectionObserver 미지원 브라우저는 즉시 시작) */
	function startProgressBarWhenVisible(){
		if(!("IntersectionObserver" in window)){
			startProgressBar();
			return;
		}

		const observer = new IntersectionObserver(function(entries){
			if(!entries[0].isIntersecting) return;

			startProgressBar();
			observer.disconnect();
		});

		observer.observe($banner[0]);
	}

	/* 슬라이드가 2개 이상이면 loop + 자동재생 + 진행바, 아니면 단일 슬라이드로 고정하고 진행바 제거 */
	if(slideCount >= 2){
		new Swiper($banner[0], {
			loop:true,
			autoplay:{delay:3000, disableOnInteraction:false},
			on:{
				slideChangeTransitionStart:resetProgressBar,
				slideChangeTransitionEnd:startProgressBar
			}
		});

		startProgressBarWhenVisible();
	}else{
		new Swiper($banner[0], {loop:false});
		$(bar).remove();
	}
}
