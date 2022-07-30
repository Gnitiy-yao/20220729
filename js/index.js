~function () {
    //1.基于AJAX获取服务器端数据，把数据存储到DATA中
    //创建AJAX实例
    let DATA = null,
        xhr = new XMLHttpRequest;
    //打开请求链接
    xhr.open("GET", "/json/product.json", false);
    //监听服务器返回的状态信息（在HTTP状态码为200，请求状态为4的时候拿到数据）
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            DATA = xhr.responseText;
        }
    }
    //发送AJAX请求
    xhr.send();
    let obj = JSON.parse(DATA);

    //2.把获取到的数据展示在页面中
    //根据获取的DATA：有多少项就动态创建多少个CARD盒子,拼接成一个总体的字符串
    let str = ``;
    obj.forEach(item => {
        //运用解构赋值
        let {
            image,
            title,
            price,
            express,
            time
        } = item;
        //把需要的数据绑定在自定义属性data-xxx上
        str += `<div class="card"
                    data-price="${price}"
                    data-express="${express}"
                    data-time="${time}">
        <img src=${image} class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-title">${title}</h6>
        <p class="card-text">价格：￥${price}</p>
        <p class="card-text">好评：${item["express"]}</p>
        <p class="card-text"><small class="text-muted">上架时间：${item["time"]}</small></p>
        </div>
        </div>`;
    });

    //3.把拼接好的字符串放到页面指定容器中（card-deck）
    let cardDeck = document.querySelector('.card-deck');
    cardDeck.innerHTML = str;

    //4.排序,实现每次点击的时候升降序切换排列

    //要操作什么就获取什么
    let lis = document.querySelectorAll("nav ul li");
    let cards = document.querySelectorAll(".card-deck .card");
    //利用slice克隆将类数组克隆为一个数组
    cards = Array.prototype.slice.call(cards, 0);
    //遍历每一个按钮
    for (let i = 0; i < lis.length; i++) {
        lis[i]["data-type"] = -1;//自定义属性"data-type",控制升降序的切换
        let data_pai = lis[i].getAttribute("data-pai");//错误写法:let data_pai = lis[i]["data-pai"];错误
        lis[i].onclick = function () {
            //设置在点了其它按钮之后重新回过来按原来这个按钮时默认升序，再点一次才是降序
            //也就是其它按钮的"data-type"回归原始状态
            [].forEach.call(lis, item => {
                if (item === this) {
                    this["data-type"] *= -1;//其实也就是将原来排序结果取反
                } else {
                    item["data-type"] = -1
                }
            })
            /*
             *  获取json数据拼接的时候提前把需要比较的数据绑定在自定义属性data-xxx上，
             *  这里可以直接通过getAttribute获取,并且为点击按钮设置data_pai等于对应的data-xxx
             */
            // 
            cards.sort((next, cur) => {
                next = next.getAttribute(data_pai);
                cur = cur.getAttribute(data_pai);
                if (data_pai === "data-time") {
                    //字符串比较中字符串只要含有一个非数字就会转化为NaN
                    next = next.replace(/-/g, '');
                    cur = cur.replace(/-/g, '');
                }
                //sort比较有三种返回值:-1,0,1,取反可以调整升降序
                return (next - cur) * this["data-type"];
            })
            cards.forEach(item => {
                //说是因为映射机制，追加的这个和原本的那个之间是有映射关系的，现在追加到末尾那么就是将原来那个移动到末尾，其它的同理
                cardDeck.appendChild(item);
            });
        }
    }
}()

