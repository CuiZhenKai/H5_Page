1.
在一个页面中,如果想要有利于SEO搜索引擎优化的话,H1标签只能使用一次

2.
viewport不是手机屏幕区域,而是展示的HTML区域,如果我们设置了viewport的宽度值,其实是在给我们的HTML设置宽度值,和手机屏幕没有必然的联系

3.
在PC端,我们viewport这个区域的宽度和浏览器可视窗口区域的宽度相同-->如果在viewport的区域中有一个盒子的宽度值已经超过了viewport的宽度值,那么当前的html页面默认就会出现滚动条

4.
在移动端,手机的宽度和viewport的宽度是不等同的,大部分手机默认的viewport的值是980,但是黑莓手机,诺基亚默认的viewport宽度是1024

5.
在移动设备上,当我们的viewport的值大于手机宽度的时候,如果手机想把页面在屏幕上全部看到的话,需要缩放vp的比例(初始缩放比例 initial-scale)
 
6.
指定当前页面viewport区域的宽度,最好和我们手机屏幕的宽度保持一致

7.
REM是相对单位,相对于页面的根元素(HTML)的字体大小设置的值

8.
box-sizing:border-box-->是CSS3中新增加的一个盒子模型属性,设定容器的高度就是我们设定的width和height的值,不管以后是否去调节边框和padding,整个盒子的高度是不变的.

9.
移动端的单击事件使用click会存在一个300毫秒的延迟,我们需要使用touchstart/touchend/touchmove来进行模拟

10.
实现魔方的触摸旋转,实现思路:
有三个事件 touchstart touchmove touchend
当touchstart的时候,记录手指触碰到的坐标,touchmove后记录两者相差的坐标,
touchend的时候减去两者的相差便可.

11.
