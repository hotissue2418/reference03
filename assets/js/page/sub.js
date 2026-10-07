/* ==========================================================
 * Sub Page
 * 서브 페이지 전용 동작 : 상담 혜택 팝업, 대표원장 스토리 플로팅 팝업, 스크롤 진입 모션
 * ========================================================== */
$(function(){
	storyPopupAction();
	subPopupAction();
	doctorStoryMotion();
});

/* 상담 혜택 팝업 : 진입 시 노출, X 버튼으로 닫기, 전화번호 자동 하이픈 */
function subPopupAction(){
	const $popup = $("#SUB_POPUP");

	if(!$popup.length) return;

	$popup.addClass("on");

	$("#SUB_POPUP_CLOSE").on("click", function(){
		$popup.removeClass("on");
	});

	$("#POPUP_CP").on("input", function(){
		const num = this.value.replace(/[^0-9]/g, "").slice(0, 11);

		this.value = num.replace(/^(\d{3})(\d{1,4})?(\d{1,4})?$/, function(_, a, b, c){
			return [a, b, c].filter(Boolean).join("-");
		});
	});
}

/* 대표원장 스토리 : 모든 행의 이미지 영역(.img-area), 첫 행 외 텍스트 영역(.txt-area), 메시지 영역이 각자 스크롤 진입 시 opacity 0 → 1, y 10px → 0
   (모바일은 이미지 → 글 세로 배치라 이미지가 먼저 노출되고 글은 따로 진입할 때 노출) */
function doctorStoryMotion(){
	if(typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

	const $targets = $(".sect-doctor-story .story-item .img-area")
		.add($(".sect-doctor-story .story-item").not(":first").find(".txt-area"))
		.add(".sect-doctor-message .message-area");

	if(!$targets.length) return;

	gsap.registerPlugin(ScrollTrigger);

	$targets.each(function(){
		gsap.fromTo(this, {opacity:0, y:10}, {
			opacity:1,
			y:0,
			duration:0.6,
			ease:"power1.out",
			scrollTrigger:{trigger:this, start:"top 85%", toggleActions:"play none none none"}
		});
	});
}

/* 대표원장 스토리 플로팅 팝업 : '접어두기' 는 미니 팝업(.fold)으로 전환, '더보기' 는 다시 펼침, '다음에 볼게요' / × 는 세션 동안 숨김 */
function storyPopupAction(){
	const $popup = $("#STORY_POPUP");

	if(!$popup.length) return;

	try{
		if(sessionStorage.getItem("storyPopupHide")){
			$popup.addClass("hide");
			return;
		}
	}catch(e){}

	function hidePopup(){
		$popup.addClass("hide");

		try{
			sessionStorage.setItem("storyPopupHide", "true");
		}catch(e){}
	}

	$("#STORY_POPUP_FOLD").on("click", function(){
		$popup.addClass("fold");
	});

	$("#STORY_POPUP_OPEN").on("click", function(){
		$popup.removeClass("fold");
	});

	$("#STORY_POPUP_LATER, #STORY_POPUP_CLOSE_SM").on("click", hidePopup);
}
