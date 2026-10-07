/* ==========================================================
 * Main Page
 * GSAP + ScrollTrigger : 섹션 타이틀 진입 모션 / 영상 딤 처리
 * Swiper : 베스트 리뷰 슬라이더
 * ========================================================== */
$(function(){
	if(!$(".sect-main-visual").length) return;

	mainScrollMotion();
	mainReviewSlider();
	mainReviewZzim();
});

/* rem 기준값(px) : html font-size 가 뷰포트에 따라 가변이므로 실시간으로 읽는다 */
function getRemPx(){
	return parseFloat($("html").css("font-size"));
}

function mainScrollMotion(){
	if(typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

	gsap.registerPlugin(ScrollTrigger);

	const rem = getRemPx(),
		trigger = function(target, start, end){
			return {trigger:target, start:start, end:end, toggleActions:"play complete reverse reset"};
		};

	/* 메인 비주얼 : 스크롤 시 영상 위 딤 */
	gsap.to(".sect-main-visual .dim-area", {
		background:"rgba(0,0,0,0.4)",
		zIndex:0,
		duration:0.4,
		ease:"power1.in",
		scrollTrigger:trigger(".sect-main-visual", "top+=200 top", "+=400")
	});

	/* 시그니처 : 각 박스 타이틀 */
	$(".sect-main-signature .signature-item").each(function(){
		gsap.to($(this).find(".tit-serif"), {
			opacity:1,
			y:-6 * rem,
			duration:0.4,
			ease:"power1.in",
			scrollTrigger:trigger(this, "top 650px", "+=400")
		});
	});

	/* 추천 이벤트 타이틀 */
	gsap.to(".sect-main-event .tit-serif", {
		opacity:1,
		y:-3,
		duration:0.4,
		ease:"power1.in",
		scrollTrigger:trigger(".sect-main-event .event-list", "top 850px", "+=600")
	});

	/* 베스트 리뷰 타이틀 */
	gsap.to(".sect-main-review .tit-serif", {
		opacity:1,
		y:-10,
		duration:0.4,
		ease:"power1.in",
		scrollTrigger:trigger(".sect-main-review", "top 650px", "+=300")
	});
}

function mainReviewSlider(){
	const $slider = $(".review-slider");

	if(!$slider.length || typeof Swiper === "undefined") return;

	new Swiper($slider[0], {
		slidesPerView:1,
		spaceBetween:30
	});
}

/* 리뷰 커버 : 찜 토글 */
function mainReviewZzim(){
	$(".review-cover .btn-zzim").on("click", function(){
		$(this).toggleClass("active");
	});
}
