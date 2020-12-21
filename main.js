// 奖品池
let prizeList = [];
// 抽奖闪烁
let lotteryInterval = null;
// 上次闪烁内容
let lastItem = null;
// 上次抽中的人
let lastplayer = 1;
// 闪烁速度，每秒钟 20 次，大部分人的 反应速度都没这么快
const flashSpeed = 20;
// 背景图片数量
const bgImageCount = 7;
// 送礼物的人的目标
// 此处等待填写
const player = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41];

// 设置奖池 placeholder 提示
$('#prizePoolText').attr('placeholder', "铅笔 10\r\n橡皮 5\r\n100元 0");

// 清理页面奖品池
function clearPagePrizePool() {
    $('#prizePool').html('');
}

// 根据奖品数量设置列数
function autoSetColumns(prizeItemCount) {
    let columnCount;
    // 奇数 则为 3列
    if (prizeItemCount % 3 === 0) {
        columnCount = 'three';
    } else {
        // 偶数 则为 4 列
        columnCount = 'four';
    }
    // 设置列数
    $('#prizePool').removeClass().addClass(`ui ${columnCount} column grid`);
}

// 生成奖池页面
function setPrizePool() {
    const warningText = '确定要清空奖池吗？如果确定请继续点击【保存设置】按钮。';
    let prizePoolText = $('#prizePoolText').val();
    if (prizePoolText.trim().length === 0) {
        $('#prizePoolText').val(warningText);
        return false;
    } else if (prizePoolText === warningText) {
        localStorage.setItem('prizePoolText', '');
        return true;
    }

    // 清理已有元素
    clearPagePrizePool();
    // 奖品数量统计
    let prizeItemCount = 0;
    for (const prizeItem of prizePoolText.split('\n')) {
        // 如果是空行就跳过
        if (prizeItem.trim().length === 0) {
            continue
        }
        // 获取奖品内容和权重
        let [prizeName, awardWeight] = prizeItem.split(' ');
        // 添加到界面
        addPrize(prizeName, awardWeight);
        // 增加到奖品数量统计
        prizeItemCount += 1
    }
    // 自动设置列数量
    autoSetColumns(prizeItemCount);
    // 保存奖池内容到 localStorage
    localStorage.setItem('prizePoolText', prizePoolText);
}

// 设置标题
function setHeader() {
    // 读取标题设置
    const showTitleIcon = $('[name="showTitleIcon"]').is(":checked");
    const showTitleText = $('[name="showTitleText"]').is(":checked");
    const titleText = $('[name="titleText"]').val().trim();
    // 保存
    localStorage.setItem('showTitleIcon', showTitleIcon);
    localStorage.setItem('showTitleText', showTitleText);
    localStorage.setItem('titleText', titleText);
    // 根据设置 修改页面
    if (showTitleIcon) {
        $('#title-icon').show();
    } else {
        $('#title-icon').hide();
    }
    if (showTitleText) {
        $('#title-text').show();
    } else {
        $('#title-text').hide();
    }
    $('#title-text').text(titleText);
    if (titleText.length === 0) {
        $('#title-text').hide();
    }
}

// 弹出设置
function showSetSettingsPanel() {
    $('#setPrizePool').modal({
        closable: true,
        onApprove: function () {
            // 设置标题
            setHeader();
            // 设置奖池
            setPrizePool();
            return true;
        },
    }).modal('show');
}

// 插入 奖品到界面
function addPrizeToPage(prizeName) {
    let html = `<div class="column" id="ListItem${prizeName}">
                    <div class="ui segment" data-name="${prizeName}">
                        <h2>${prizeName}</h2>
                    </div>
                </div>`;
    $('#prizePool').append(html);
}

// 添加奖品，奖品名称、获奖权重
// 权重无极限
function addPrize(prizeName, awardWeight) {
    // 放大权重，增加权重准确度
    let tmpAwardWeight = parseInt(awardWeight) * 10;
    // 默认权重 100
    if (typeof awardWeight != 'string') {
        tmpAwardWeight = 100
    }
    for (var i = 0; i < tmpAwardWeight; i++) {
        prizeList.push(prizeName);
    }

    // 插入 奖品到界面
    addPrizeToPage(prizeName);
}

// 开始抽奖
function startLottery() {
    // 设置闪烁定时器
    lotteryInterval = setInterval(function () {
        // 不允许和上次闪烁的重复
        let randomPrizeName = prizeList[Math.floor(Math.random() * prizeList.length)];
        while (randomPrizeName === lastItem) {
            randomPrizeName = prizeList[Math.floor(Math.random() * prizeList.length)];
        }
        // 记录上次重复的内容
        lastItem = randomPrizeName;

        // 高亮颜色
        let highlightedColor = 'inverted blue';
        // 清除之前的高亮
        $(`[data-name]`).removeClass(highlightedColor);
        // 设置当前为高亮
        $(`[data-name=${randomPrizeName}]`).addClass(highlightedColor).transition({
            animation: 'pulse',
            duration: `${parseInt(1000 / flashSpeed) * 2}ms`
        });
    }, parseInt(1000 / flashSpeed))
}

// 停止抽奖
function stopLottery() {
    clearInterval(lotteryInterval);
}

// 弹出 设置皮肤
function showSetSkinPanel() {
    $('#setSkin').modal('show');
}

// 初始化页面图片
// 为了减少代码
function initSkin() {
    // 生成图片元素
    let genImg = function (imgNumber) {
        return `<div class="column">
                    <div class="ui segment">
                        <img class="ui medium image" src="background/${imgNumber}.jpg" alt="背景">
                    </div>
                </div>`
    }
    // 批量添加
    for (let i = 1; i <= bgImageCount; i++) {
        $('#skinImgContainer').append(genImg(i));
    }

    // 设置皮肤被选择后发生的事情
    $('img').click(function () {
        // 读取图片链接
        let bgImgSrc = $(this).attr('src');
        // 修改页面背景
        $('body').css({'background-image': `url("${bgImgSrc}")`, 'background-repeat': 'repeat'});
        // 清除其他图片高亮
        $('#setSkin .segment').removeClass('red');
        // 高亮被选择的图片
        $(this).parent().addClass('red');
        // 保存背景图片到 localStorage
        localStorage.setItem('lastBgImage', bgImgSrc);
    });

    // 读取之前设置过的背景图片
    let lastBgImage = localStorage.getItem('lastBgImage');
    console.log(lastBgImage);
    if (typeof lastBgImage === 'string' && lastBgImage.trim().length !== 0) {
        // 设置背景
        $('body').css({'background-image': `url("${lastBgImage}")`, 'background-repeat': 'repeat'});
        // 设置高亮
        $(`img[src="${lastBgImage}"]`).parent().addClass('red');
    }
    else
    {
        // 设置背景
        $('body').css({'background-image': `url("background/2.jpg")`, 'background-repeat': 'repeat'});
        // 设置高亮
        $(`img[src="${lastBgImage}"]`).parent().addClass('red');
    }
}

// 初始化
function init() {
    prizePoolText.value="1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40\n41";
    // 设置抽奖按钮
    $('#controlButton').click(function () {
        let startTitle = '开始抽奖';
        let stopTitle = '停止抽奖';
        let currentTitle = $(this).text();
        if (currentTitle === startTitle) {
            startLottery();
            $(this).text(stopTitle)
        } else if (currentTitle === stopTitle) {
            stopLottery();
            // 高亮颜色
            let highlightedColor = 'inverted blue';
            // 清除之前的高亮
            $(`[data-name]`).removeClass(highlightedColor);
            // 设置目标为高亮
            $(`[data-name=${player[lastplayer]}]`).addClass(highlightedColor).transition({
                animation: 'pulse',
                duration: `${parseInt(1000 / flashSpeed) * 2}ms`
            });
            prizeList.splice(lastplayer-1,1);
            $('div#ListItem'+lastplayer).remove();
            lastplayer=player[lastplayer];
            $(this).text(startTitle);
        }
    });

    // 设置白色背景被选择
    $('.noneBg').click(function () {
        // 清除已保存的图片
        localStorage.removeItem('lastBgImage');
        // 清理掉背景
        $('body').css({'background-image': "", 'background-repeat': ""});
        // 清除其他图片高亮
        $('#setSkin .segment').removeClass('red');
    })

    // 读取之前设置过的奖池
    const lastPrizePoolText = localStorage.getItem('prizePoolText');
    if (typeof lastPrizePoolText !== 'string' || lastPrizePoolText.trim().length === 0) {
        // 开启设置
        showSetSettingsPanel();
    } else {
        // 根据上次的奖池来生成页面
        $('#prizePoolText').val(lastPrizePoolText);
        setPrizePool();
    }

    // 读取标题设置
    const showTitleIcon = localStorage.getItem("showTitleIcon");
    const showTitleText = localStorage.getItem("showTitleText");
    const titleText = localStorage.getItem("titleText");
    // 设置标题设置
    if (typeof showTitleIcon !== 'string' || showTitleIcon === "true") {
        $('[name="showTitleIcon"]').prop("checked", "checked");
    }
    if (typeof showTitleText !== 'string' || showTitleText === "true") {
        $('[name="showTitleText"]').prop("checked", "checked");
    }
    if (typeof titleText === 'string') {
        $('[name="titleText"]').val(titleText);
    } else {
        $('[name="titleText"]').val('圣诞抽奖');
    }
    // 根据标题设置修改页面
    setHeader();

    // 初始化背景皮肤
    initSkin();

    // 初始化基本组件
    $('.ui.checkbox').checkbox();
}

// 初始化
init();
