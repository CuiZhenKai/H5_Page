// 下面的代码是为了方便开发的辅助代码
// 在字符串的原型上,扩展一个方法:获取URL地址参数
// String.prototype
~function (pro){
    function queryURLParameter(){
        let reg = /([^?=&#]+)=([^?=&#]+)/g
            obj = {};
        this.replace(reg,function (){
            obj[arguments[1]]  = arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

// 为了区分每一个模块,我们使用单例模式来开发

// loading区域:加载所有的图片,加载完成后进入下一个页面
// 加载过程中,根据图片的加载的进度对应进度条的长度显示
let LoadingRender = ( ()=>{

    // 存放所有图片的数组
    let ary = ["icon.png","zf_concatAddress.png","zf_concatInfo.png","zf_concatPhone.png","zf_course.png","zf_course1.png","zf_course2.png","zf_course3.png","zf_course4.png","zf_course5.png","zf_course6.png","zf_cube1.png","zf_cube2.png","zf_cube3.png","zf_cube4.png","zf_cube5.png","zf_cube6.png","zf_cubeBg.jpg","zf_cubeTip.png","zf_emploment.png","zf_messageArrow1.png","zf_messageArrow2.png","zf_messageChat.png","zf_messageKeyboard.png","zf_messageLogo.png","zf_messageStudent.png","zf_outline.png","zf_phoneBg.jpg","zf_phoneDetail.png","zf_phoneListen.png","zf_phoneLogo.png","zf_return.png","zf_style1.jpg","zf_style2.jpg","zf_style3.jpg","zf_styleTip1.png","zf_styleTip2.png","zf_teacher1.png","zf_teacher2.png","zf_teacher3.jpg","zf_teacher4.png","zf_teacher5.png","zf_teacher6.png","zf_teacherTip.png"];

    // 获取需要操作的元素
    let $loading = $('#loading'),
        $progressEm = $loading.find('.progressBox');

    // 定义加载图片需要的变量
    let step = 0,
        total = ary.length;
    return {
        init:function (){

            //进入模块,首先让这个模块显示
            $loading.css('display','block');

            // 循环加载所有的图片,控制进度条的宽度
            $.each(ary,(index,item)=>{
                let oImg = new Image();
                oImg.src = 'img/' + item;
                oImg.onload = function (){

                    step++;
                    $progressEm.css('width',step/total*100+'%');

                    // 为了优化内存,将新创建的内存释放掉
                    oImg = null;

                    //所有图片加载完成:关闭loading层,显示phone层
                    if(step === total){
                        if(page === 0) return;
                        window.setTimeout(()=>{
                            $loading.css('display','none');
                            phoneRender.init();
                        },2000);
                    }
                }
            })
        }
    }
})();

// phone模块
let phoneRender = (() =>{


    // 获取phone区域所有操控的元素
    let $phone = $('#phone'),
        $listen = $phone.children('.listen'),
        $listenTouch = $listen.children('.touch'),
        $details = $phone.children('.details'),
        $detailsTouch = $details.children('.touch'),
        $time = $phone.children('.time');

    // 音频处理
    // 在后面加上[0]可以获取到原生的属性和方法
    let listenMusic = $('#listenMusic')[0],
        detailsMusic = $('#detailsMusic')[0],
        musicTimer = null;

    // 播放自我介绍音乐
    function detailsMusicFn(){

        // 播放自我介绍
        detailsMusic.play();

        musicTimer = window.setInterval(function (){
            let curTime = detailsMusic.currentTime,
                minute = Math.floor(curTime/60),
                second = Math.floor(curTime);
            minute < 10 ? minute = '0' + minute : null;
            second < 10 ? second = '0' + second : null;
            $time.html(minute + ':' + second);

            // 音频播放完成
            let totalTime = detailsMusic.duration;
            if(curTime === totalTime){
                window.clearInterval(musicTimer);
                closePhoneFn();
            }
        },1000);
    }

    // 关闭手机接听页面
    function closePhoneFn(){
        detailsMusic.pause();
        let screenHeight = document.documentElement.clientHeight;
        $phone.css('transform','translateY('+screenHeight+'px)').on('webkitTransitionEnd',function (){
            $phone.css('display','none');
        });
        MessageRender.init();
    }
    
    return {
        init:function (){
            // 进入模块,首先使模块显示
            $phone.css('display','block');

            // 电话铃声响起
            listenMusic.play();

            // 接听按钮添加点击事件
            $listenTouch.singleTap(function (){
                $listen.css('display','none');

                // 点击接听,铃声结束播放
                listenMusic.pause();

                $details.css('transform','translateY(0rem)');
                $time.css('display','block');

                detailsMusicFn();
            });

            //  挂断按钮添加点击事件
            $detailsTouch.singleTap(function (){
                closePhoneFn();
            });
        }
    }
})();


// MESSAGE模块
let MessageRender = (()=>{

    let $message = $('#message'),
        $messageList = $message.children('.messageList'),
        $list = $messageList.children('li'),
        $keyBoard = $message.children('.keyBoard'),
        $textTip = $keyBoard.children('.textTip'),
        $submit = $keyBoard.children('.submit'),
        messageMusic = $('#messageMusic')[0];

    let autoTimer = null,
        step = -1,
        total = $list.length,
        bounceTop = 0;

    // 实现消息列表一条一条的发送
    function messageMove(){
        autoTimer = window.setInterval(function (){
            step++;
            let $cur = $list.eq(step);
            $cur.css({
                opacity:1,
                transform:'translateY(0rem)'
            });

            // 当发送完成第三条的时候,开启键盘操作
            if(step === 2){
                window.clearInterval(autoTimer);
                $keyBoard.css('transform','translateY(0rem)');
                $textTip.css('display','block');
                textMove();
            }

            // 从第四条开始,没发送一条消息,都需要让整个消息区域向上移动
            if(step >= 3){
                bounceTop -= $cur[0].offsetHeight + 10;
                $messageList.css('transform','translateY('+bounceTop+'px)');
            }

            // 当消息发送完成
            if(step === total - 1){
                window.clearInterval(autoTimer);
                window.setTimeout(function (){
                    if(page === 2) return;
                    $message.css('display','none');
                    messageMusic.pause();
                    cubeRender.init();
                },1500);
            }
        },1500);
    }

    // 实现文字打印机效果
    function textMove(){
        let text = '那当时是了,这还用问吗!',
            len = text.length - 1,
            textTimer = null,
            n = -1,
            result = '';
        textTimer = window.setInterval(function (){
            n++;
            result += text[n];
            $textTip.html(result);

            if(n === len){
                window.clearInterval(textTimer);
                $submit.css('display','block').singleTap(function (){
                    $textTip.css('display','none');
                    $keyBoard.css('transform','translateY(3.7rem)');
                    messageMove();
                });
            }
        },100);
    }

    return {
        init:function (){
        
            $message.css('display','block');
            messageMove();
            messageMusic.play();
        }
    }
})();


// 魔方区域
let cubeRender = (function (){

    let $cube = $('#cube'),
        $cubeBox = $cube.children('.cubeBox'),
        $cubeBoxLis = $cubeBox.children('li');

    // 清除用户的误操作
    function isSwipe(changeX,changeY){
        return Math.abs((changeX) > 30 || (changeY) > 30);
    }

    // 滑动的处理:
    // 每一个方法触发的时候都会有一个事件对象ev,存储我们当前手指的一些操作
    // 滑动开始
    function start(ev){
        let point = ev.touches[0];
        // 记录当前手指按下时的起始坐标
        $(this).attr({
            strX:point.clientX,
            strY:point.clientY,
            changeX:0,
            changeY:0
        });
    }
    // 滑动
    function move(ev){
        let point = ev.touches[0];
        let changeX = point.clientX - $(this).attr('strX'),
            changeY = point.clientY - $(this).attr('strY');
        $(this).attr({
            changeX:changeX,
            changeY:changeY
        })
    }
    // 滑动结束
    function end(ev){
        let changeX = parseFloat($(this).attr('changeX')),
            changeY = parseFloat($(this).attr('changeY')),
            rotateX = parseFloat($(this).attr('rotateX')),
            rotateY = parseFloat($(this).attr('rotateY'));
        if(isSwipe(changeX,changeY) === false) return;
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;

        $(this).attr({
            rotateX:rotateX,
            rotateY:rotateY
        }).css('transform',`scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);

    }

    return {
        init:function (){
            $cube.css('display','block');

            // 记录魔方的属性值
            $cubeBox.attr({
                // 记录当前盒子起始的X轴的旋转角度
                rotateX:-35,
                // 记录当前盒子起始的Y轴的旋转角度
                rotateY:45
            }).on('touchstart',start)
              .on('touchmove',move)
              .on('touchend',end);


            // 每一个页面的点击操作
            $cubeBoxLis.singleTap(function (){
                let listIndex = $(this).index();
                $cube.css('display','none');
                swiperRender.init(listIndex);
            });
        }
    }
})();

// swiper区域
let swiperRender = function (){
    let $swiper = $('#swiper'),
        $makisu = $('#makisu'),
        $swiperReturn = $swiper.children('.return');
    
    // 页面切换动画
    function change(example){
        let  slideAry = example.slides,
                         activeIndex = example.activeIndex;
                    if(activeIndex === 1){
                        $makisu.makisu({
                            selector:'dd',
                            overlap:0.6,
                            speed:0.8
                        });
                        $makisu.makisu('open');
                    }else{
                        $makisu.makisu({
                            selector:'dd',
                            overlap:0.6,
                            speed:0
                        });
                        $makisu.makisu('close');
                    }
                    $.each(slideAry,function (index,item){
                        if(index === activeIndex){
                            item.id = 'page' + (activeIndex);
                            return;
                        }
                        item.id = null;
                    });
    }
    return {
        init:function (index){
            $swiper.css('display','block');

            // 初始化SWIPER,实现6个页面之间的切换
            let mySwiper = new Swiper('.swiper-container',{
                loop:true,
                effect:'cube',
                onTransitionEnd:change,
                onInit:change
            });
            index = index || 0;
            mySwiper.slideTo(index,0);

            // 返回按钮绑定点击
            $swiperReturn.singleTap(function (){
                $swiper.css('display','none');
                $('#cube').css('display','block');
            })
        }
    }
}();



// {
// 辅助开发的代码
    let urlObj = window.location.href.queryURLParameter(),
    page = parseFloat(urlObj['page']);
    if(page ===0 || isNaN(page)){
    LoadingRender.init();
    }
    if(page === 1){
    phoneRender.init();
    }
    if(page === 2){
    MessageRender.init();
    }
    if(page === 3){
        cubeRender.init();
    }
    if(page === 4){
        swiperRender.init(1);
    }
// }
