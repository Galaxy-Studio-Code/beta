// 抽奖闪烁
let lotteryInterval = null;
// 上次闪烁内容
let lastItem = null;
// 记录是否已经抽到过
let used = [];
// 记录还未被抽到的人数
let player = 0;
// 闪烁速度，每秒钟 25 次
const flashSpeed = 25;
// 背景图片数量
const bgImageCount = 7;

// 设置奖池 placeholder 提示
$('#prizePoolText').attr('placeholder', "1 41");

// 清理页面奖品池
function clearPagePrizePool() {
    $('#prizePool').html('');
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

    // 获取起始学号和终止学号
    let [start, end] = prizePoolText.split(' ');
    // 显示学号
    addPrize(start, end);


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

// 插入学号到界面
function addPrizeToPage(Name) {
    let html = `<div class="column"">
                    <div class="ui segment inverted blue" data-name="${Name}" id="ListItem">
                        <h2>${Name}</h2>
                    </div>
                </div>`;
    $('#prizePool').append(html);
}

// 添加学号
function addPrize(start, end) {
    addPrizeToPage("???");
}

// 开始抽奖
function startLottery() {
    // 设置闪烁定时器
    lotteryInterval = setInterval(function () {
            // 不允许和上次闪烁的重复
            let tmp = 0;
            let randomPrizeName;
            var seed = (new Date()).getTime();
            seed = (seed * 9301 + 49297) % 233280;
            randomPrizeName = Math.ceil(seed / (233280.0) * 41);

            while (randomPrizeName === lastItem || used[randomPrizeName] === true || randomPrizeName === player) {
                if (tmp > 3) {
                    let f = -1;
                    for (var i = (randomPrizeName * Math.floor(Math.random() * 20)) % 41; i <= 41; i++) {
                        if (used[i] === false) {
                            f = i;
                            break;
                        }
                    }
                    if (f !== -1) {
                        randomPrizeName = f;
                        break;
                    }
                }
                seed = (new Date()).getTime();
                seed = (seed * 9301 + 49297) % 233280;
                randomPrizeName = Math.ceil(seed / (233280.0) * 41);
                tmp++;
            }
            // 记录上次重复的内容
            lastItem = randomPrizeName;

            // 更改显示的学号
            if (lastItem < 10) {
                let html = `<div class="ui segment inverted blue" data-name="${lastItem}" id="ListItem">
                        <h2>0${lastItem}</h2>
                    </div>`;
                $(ListItem).replaceWith(html);
            } else {
                let html = `<div class="ui segment inverted blue" data-name="${lastItem}" id="ListItem">
                        <h2>${lastItem}</h2>
                    </div>`;
                $(ListItem).replaceWith(html);
            }
        }

        ,
        parseInt(1000 / flashSpeed)
    )
}

// 停止抽奖
function stopLottery() {
    clearInterval(lotteryInterval);
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
    if (typeof lastBgImage === 'string' && lastBgImage.trim().length !== 0) {
        // 设置背景
        $('body').css({'background-image': `url("${lastBgImage}")`, 'background-repeat': 'repeat'});
        // 设置高亮
        $(`img[src="${lastBgImage}"]`).parent().addClass('red');
    } else {
        // 设置背景
        $('body').css({'background-image': `url("background/2.jpg")`, 'background-repeat': 'repeat'});
        // 设置高亮
        $(`img[src="${lastBgImage}"]`).parent().addClass('red');
    }
}

// 初始化
function init() {
    console.log("年轻人你不讲武德，来骗，来偷袭，我刚做完抽奖系统！这好吗？这不好。我劝你耗子尾汁，发邮件到 Galaxy-Studio-Code@galaxy-studio.ga 加入星际工作室（请注明来自Console）")
    console.log("\n" +
        "                                      *\n" +
        "                                    _/ \\_\n" +
        "                                   \\     /\n" +
        "                                   /_' '_\\\n" +
        "                                    / o*\\\n" +
        "                                   /'   +\\\n" +
        "                                  /  '@  -\\\n" +
        "                                 /'*@*''* +\\\n" +
        "                                / o@ + .++o \\\n" +
        "                               /+ *  '   .'  \\\n" +
        "                              /  ''* 'oo+.o++ \\\n" +
        "                             / -+'    o.o-  +  \\\n" +
        "                            /*-  o+o-@o'o @  .* \\\n" +
        "                           /.   o-. + - oo+- o . \\\n" +
        "                          / + ''     '   --@'@ .  \\\n" +
        "                         /@ @*   ..'-@  o..-  *.  @\\\n" +
        "                        /*  * ' +*.' 'oo   @ * o   o\\\n" +
        "                       /*  @..@.. +@.    + @ o +o@* *\\\n" +
        "                      /  ..  + -. o+ .*.'+   + @@-@+@*\\\n" +
        "                     /  *      @o  @ .  ++''@++o '     \\\n" +
        "                    /   -*.  '* o ' + .'  *'o o  ' . +-'\\\n" +
        "                   / o.@o-'.o*@    .    +  *o.o+-@  '  +-\\\n" +
        "                  /@ --     - '+'@'-- o    -.   *@.'@ ''  \\\n" +
        "                 /+   +        ' -.o- ' .*@o    o+ @'+  -+'\\\n" +
        "                / +  o@      ' -+  @  - @  + @   *   - ' o' \\\n" +
        "               /  o @.      * -' @  -'@  @   ** -@   '@ *.- '\\\n" +
        "              /*  +o *   ' +..--@+ o@'  * @    @   o+ .o@ . - \\\n" +
        "             /@    *o*'@ *.  ''* '@@   ''  ' -  @oo @* .+  @  +\\\n" +
        "            /'o  @@+*   '+'' .o.@*'  * @ .oo+. *. .*@+   @   ++ \\\n" +
        "           /o  *    o**- - @o oo  .. - +'+o  @' o    *o  - @    +\\\n" +
        "          /.'-  .*- ' .*.   '.   -    -+.-.+*    '.o.* . ' @-@ @*o\\\n" +
        "         / @     .*      -  @-.@  +.-    ** ''@* @-  o*@*.o'*  .'-'\\\n" +
        "        / -  -o ' @ @ @oo  + @ @*  @ ' o   ' *o'+--.  *         *   \\\n" +
        "       / o---... - ++o+- ---  ..o @  -. '*+ o * '  + * * @*.@* . -   \\\n" +
        "      /'  @@  ' * *      o* +@-' '-+*o+o' +  o   '- @* '@..*    '-+*  \\\n" +
        "     /' +.  -   +- o@ ..+- @.@  -' '-'   . '  .  +@o.o  @+ '.+-  .  +o*\\\n" +
        "    /.+-. +  - .-+' + *o @ +'+ -    @*- .      + '     --@'  @    . -. -\\\n" +
        "    *--------------------------------------------------------------------*\n" +
        "                           [_____________________]\n" +
        "                              \\_______________/\n")
    prizePoolText.value = "1 41";
    for (var i = 1; i <= 45; i++) {
        used[i] = false;
    }

    // 设置抽奖按钮
    $('#controlButton').click(function () {
        let startTitle = '开始抽奖';
        let stopTitle = '停止抽奖';
        let currentTitle = $(this).text();
        if (currentTitle === startTitle) {
            player++;
            console.log(player);
            if (player < 42) {
                startLottery();
                $(this).text(stopTitle);
            } else {
                if (player === 42) {
                    let html = `<div class="ui segment inverted blue" data-name="${lastItem}" id="ListItem">
                        <h2>没有啦！</h2>
                    </div>`;
                    $(ListItem).replaceWith(html);
                } else if (player % 2 === 0) {
                    let html = `<div class="ui segment inverted blue" data-name="${lastItem}" id="ListItem">
                        <h2>1号前面的同学……</h2>
                    </div>`;
                    $(ListItem).replaceWith(html);
                } else {
                    let html = `<div class="ui segment inverted blue" data-name="${lastItem}" id="ListItem">
                        <h2>41号之后的同学是无法预测的</h2>
                    </div>`;
                    $(ListItem).replaceWith(html);
                }
            }
        } else if (currentTitle === stopTitle) {
            stopLottery();
            used[lastItem] = true;
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
        $('[name="titleText"]').val('Happy Christmas!');
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