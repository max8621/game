const log = console.log.bind(console)

//canvas1上摆放静态纸牌
let canvas = document.querySelector('#id-canvas')

let context =canvas.getContext('2d')
//canvas2上实现纸牌动画
let canvas2 = document.querySelector('#id-canvas2')

let context2 =canvas2.getContext('2d')
//画圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y, x+w, y+h, r);
    this.arcTo(x+w, y+h, x, y+h, r);
    this.arcTo(x, y+h, x, y, r);
    this.arcTo(x, y, x+w, y, r);
    this.closePath();
    return this;
}

//设置纸牌参数
//纸牌宽95
let w = 95
//纸牌高127
let h = 127
let h1 = h
//牌堆横向间距15
let l = 15
//堆叠的stacks中牌面露出来的间距25
let d = 25
//r是圆角矩形的圆角半径
let r = 13
//20,20是牌库cardLib的初始坐标
let dx0 = 20
let dy0 = 20
//上行牌堆与下行牌堆的间距53
let dy1 = 53

class Card {
    constructor(number, char, icon, color, dx, dy, open) {
        this.number = number
        this.char = char
        this.icon = icon
        this.color = color
        this.dx = dx
        this.dy = dy
        this.open = open
    }
    show() {
        log(`${this.icon} ${this.char} ${this.dx} ${this.dy}`)
    }

    //在canvas1上画纸牌，canvas1上有未翻开的牌
    draw()  {
        let dx = this.dx
        let dy = this.dy
        if(this.open) {
            //画牌正面
            context.drawPokerCard(dx,dy,h,this.icon,this.char);
        }else {
            //画牌背面
            context.drawPokerBack (dx, dy, h, '#b5b5dc', '#6060a3');
        }
    }
    //在canvas2上画纸牌，canvas2是绘制纸牌拖拽动画的图层
    draw2()  {
        let dx = this.dx + 95/2 - 95*h1/254
        let dy = this.dy
        if (h1 <= 135) {
            h1 += 0.5
        }
        if(this.open) {
        //画牌正面
        context2.drawPokerCard(dx,dy,h1,this.icon,this.char);
            //画牌背面
        }else {context2.drawPokerBack (dx, dy, h1, '#b5b5dc', '#6060a3');
        }
    }
    //判断鼠标是否点击到牌面，牌面 w * h 像素
    haspoint(x, y) {
        let xIn = x >= this.dx && x <= this.dx + w
        let yIn = y >= this.dy && y <= this.dy + h
        return xIn && yIn
    }
    //判断鼠标是否点击到堆叠的牌面，堆叠的牌面露出来的只有w*d像素
    haspoint2(x, y) {
        let xIn = x >= this.dx && x <= this.dx + w
        let yIn = y >= this.dy && y <= this.dy + d-1
        return xIn && yIn
    }
}
//判断鼠标是否点击到空的stacks(下行牌堆)
const haspoint3=function(x, y, i) {
    let xIn = x >= dx0 + (w + l) * i && x <= dx0 + w + (w + l) * i
    let yIn = y >= (h + dy0 + dy1) && y <= (h + dy0 + dy1) + h
    return xIn && yIn
}
//判断鼠标是否点击到上行牌堆(包括牌库，丢牌堆，花色堆)
const haspoint4=function(x, y, i) {
    let xIn = x >= dx0 + (w + l) * i && x <= dx0 + w + (w + l) * i
    let yIn = y >= dy0 && y <= dy0 + h
    return xIn && yIn
}
//判断鼠标按下坐标和弹起坐标是否相等(原地点击)
const point=function(x, y, x1, y1) {
    return (x === x1) && (y === y1)
}


//洗牌算法
const fyShuffle = function (arr) {
    let _arr = arr.concat();
    for (let i = _arr.length - 1; i > 0; i--) {
        let ind = Math.floor(i * Math.random());
        [_arr[i], _arr[ind]] = [_arr[ind], _arr[i]];
    }
    return _arr;
}

const charMapper = {
    '1': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    '11': 'J',
    '12': 'Q',
    '13': 'K',
}

const __main = () => {
    // 初始化 13 个红桃 ♥
    let cs = []

    for (let i = 1; i <= 13; i++) {
        let number = i
        let char = String(i)
        char = charMapper[char]
        let icon = 'h'
        let color = 'red'
        let dx = dx0
        let dy = dy0
        let open = false
        let c = new Card(number, char, icon, color, dx, dy, open)
        cs.push(c)
    }
    // 初始化 13 个方块 ◇
    for (let i = 1; i <= 13; i++) {
        let number = i
        let char = String(i)
        char = charMapper[char]
        let icon = 'd'
        let color = 'red'
        let dx = dx0
        let dy = dy0
        let open = false
        let c = new Card(number, char, icon, color, dx, dy, open)
        cs.push(c)
    }
    // 初始化 13 个梅花 ♣
    for (let i = 1; i <= 13; i++) {
        let number = i
        let char = String(i)
        char = charMapper[char]
        let icon = 'c'
        let color = 'black'
        let dx = dx0
        let dy = dy0
        let open = false
        let c = new Card(number, char, icon, color, dx, dy, open)
        cs.push(c)
    }
    // 初始化 13 个黑桃 ♠
    for (let i = 1; i <= 13; i++) {
        let number = i
        let char = String(i)
        char = charMapper[char]
        let icon = 's'
        let color = 'black'
        let dx = dx0
        let dy = dy0
        let open = false
        let c = new Card(number, char, icon, color, dx, dy, open)
        cs.push(c)
    }
    // 洗牌
    cs = fyShuffle(cs)


    // stacks 是 7 个牌堆
    let stacks = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ]
    //定义四个花色堆suitpiles
    let suitpiles = [
        [],
        [],
        [],
        [],
    ]

    // cardLib 是发牌堆
    let cardLib = []
    // DiscardLib 丢牌堆
    let DiscardLib = []
    // index 是所有牌的下标
    let index = 0
    //发牌，并且更新牌的坐标
    for (let i = 0; i < 7; i++) {
        let s = stacks[i]
        for (let j = 0; j < i + 1; j++) {
            cs[index].dx = dx0 + (w + l) * i
            cs[index].dy = (h + dy0 + dy1) + d * j
            if (j === i) {
                cs[index].open = true
            }
            s.push(cs[index])
            index += 1
        }
    }
    //发完stacks牌堆的牌，剩下的放入发牌堆cardLib
    for (let i = index; i < 52; i++) {
        cardLib.push(cs[i])
    }

    // 发牌堆到丢弃堆
    //cardLib.pop()
    //DiscardLib.push(cardLib[cardLib.length - 1])
    //d1是丢牌堆中牌面露出来的间距25
    let d1 = 25
    const DiscardLibreset = function() {
        if (DiscardLib.length === 1) {
            DiscardLib[0].dx = dx0 + (w + l)
        }
        if (DiscardLib.length > 1) {
            DiscardLib[DiscardLib.length-2].dx = dx0 + (w + l) + d1
            DiscardLib[DiscardLib.length-1].dx = dx0 + (w + l)
        }
    }
    //点击自动飞牌  点击丢牌堆
    const flash = function (c) {
        if (c.number === 1) {
            let flag = 1
            for (let i = 0; i < 4 * flag; i++) {
                let s = suitpiles[i]
                if (s.length === 0) {
                    c.dx = dx0 + (w + l) * (3 + i)
                    s.push(c)
                    DiscardLib.pop ()
                    DiscardLibreset()
                    flag = 0
                }
            }
        } else if (c.number !== 1) {
            let moved = false
            let flag = 1
            for (let i = 0; i < 4 * flag; i++) {
                let s = suitpiles[i]
                if (s.length !== 0) {
                    let c2 = s[s.length-1]
                    if (c2.icon === c.icon && c2.number === c.number - 1) {
                        c.dx = dx0 + (w + l) * (3 + i)
                        s.push(c)
                        DiscardLib.pop ()
                        DiscardLibreset()
                        moved = true
                        flag = 0
                    }
                }
            }
            if (moved !== true) {
                flag = 1
                for (let i = 0; i < 7 * flag; i++) {
                    let s = stacks[i]
                    if (s.length !== 0) {
                        let c2 = s[s.length-1]
                        if (c2.color !== c.color && c2.number === c.number + 1) {
                            c.dx = c2.dx
                            c.dy = c2.dy + d
                            s.push(c)
                            DiscardLib.pop ()
                            DiscardLibreset()
                            flag = 0
                        }
                    } else if (s.length === 0) {
                        if (c.number === 13) {
                            c.dx = dx0 + (w + l) * i
                            c.dy = (h + dy0 + dy1)
                            s.push (c)
                            DiscardLib.pop ()
                            DiscardLibreset()
                            flag = 0
                        }
                    }
                }
            }
        }
    }
    //点击自动飞牌2  点击stacks牌堆每列最后一张
    const flash2 = function (a, b, c) {
        if (c.number === 1) {
            let flag = 1
            for (let i = 0; i < 4 * flag; i++) {
                let s = suitpiles[i]
                if (s.length === 0) {
                    c.dx = dx0 + (w + l) * (3 + i)
                    c.dy = dy0
                    s.push(c)
                    if (b >= 1) {
                        stacks[a][b-1].open = true
                    }
                    stacks[a].pop()
                    flag = 0
                }
            }
        }else if (c.number !== 1) {
            let moved = false
            let flag = 1
            for (let i = 0; i < 4 * flag; i++) {
                let s = suitpiles[i]
                if (s.length !== 0) {
                    let c2 = s[s.length-1]
                    if (c2.icon === c.icon && c2.number === c.number - 1) {
                        c.dx = dx0 + (w + l) * (3 + i)
                        c.dy = dy0
                        s.push(c)
                        if (b >= 1) {
                            stacks[a][b-1].open = true
                        }
                        stacks[a].pop()
                        moved = true
                        flag = 0
                    }
                }
            }
            if (moved !== true) {
                flag = 1
                for (let i = 0; i < 7 * flag; i++) {
                    let s = stacks[i]
                    if (s.length !== 0) {
                        let c2 = s[s.length-1]
                        if (c2.color !== c.color && c2.number === c.number + 1) {
                            c.dx = c2.dx
                            c.dy = c2.dy + d
                            s.push(c)
                            if (b >= 1) {
                                stacks[a][b-1].open = true
                            }
                            stacks[a].pop()
                            flag = 0
                        }
                    } else if (s.length === 0) {
                        if (c.number === 13) {
                            c.dx = dx0 + (w + l) * i
                            c.dy = (h + dy0 + dy1)
                            s.push (c)
                            if (b >= 1) {
                                stacks[a][b-1].open = true
                            }
                            stacks[a].pop()
                            flag = 0
                        }
                    }
                }
            }
        }
    }
    //点击自动飞牌3  点击stacks牌堆非每列最后一张
    const flash3 = function (a, b, cs) {
        let flag = 1
        for (let i = 0; i < 7 * flag; i++) {
            let s = stacks[i]
            if (s.length !== 0) {
                let c2 = s[s.length-1]
                if (c2.color !== cs[0].color && c2.number === cs[0].number + 1) {
                    for (let j = 0; j < cs.length; j++) {
                        let c = cs[j]
                        c.dx = c2.dx
                        c.dy = c2.dy + d + d * j
                        s.push(c)
                        stacks[a].pop()
                    }
                    if (b >= 1) {
                        stacks[a][b-1].open = true
                    }
                    flag = 0
                }
            } else if (s.length === 0) {
                if (cs[0].number === 13) {
                    for (let j = 0; j < cs.length; j++) {
                        let c = cs[j]
                        c.dx = dx0 + (w + l) * i
                        c.dy = (h + dy0 + dy1) + d * j
                        s.push (c)
                        stacks[a].pop()
                    }
                    if (b >= 1) {
                        stacks[a][b-1].open = true
                    }
                    flag = 0
                }
            }
        }
    }



    //绘制canvas1
    const drawcanvas = function () {
        context.clearRect(0, 0, 795, 750)
        //画十三个方框
        context.lineWidth = 3;
        context.strokeStyle = "#00b100";
        let B = context.lineWidth
        for (let i = 0; i < 14; i++) {
            let x = dx0 + B + (w + l) * i
            let y = dy0 + B
            let w1 = w - 2*B
            let h1 = h - 2*B
            if( i !== 2) {
                if (i > 6) {
                    x = dx0 + B + (w + l) * i - (w + l) * 7
                    y = (h + dy0 + dy1) + B
                }
                context.roundRect(x, y, w1, h1, r).stroke();
            }
        }

        //画stacks牌堆
        for (let i = 0; i < 7; i++) {
            let s = stacks[i]
            //log(`------ 牌堆 ${i}`)
            for (let j = 0; j < s.length; j++) {
                let c = s[j]
                //c.show()
                c.draw()
            }
        }
        //写上丢牌堆牌的张数
        context.font="50px sans-serif";
        context.strokeStyle='#00b100';
        if (DiscardLib.length >= 10) {
            context.strokeText(DiscardLib.length,dx0+20,dy0+80);
        } else if (DiscardLib.length < 10 && DiscardLib.length > 0) {
            context.strokeText(DiscardLib.length,dx0+35,dy0+80);
        }

        //画cardLib牌库
        for (let j = 0; j < cardLib.length; j++) {
            let c = cardLib[j]
            c.draw()
        }

        //画DiscardLib丢牌库
        for (let i = 0; i < DiscardLib.length; i++) {
            let c = DiscardLib[i]
            c.draw()
        }

        //画suitpiles花色堆
        for (let i = 0; i < 4; i++) {
            let s = suitpiles[i]
            for (let j = 0; j < s.length; j++) {
                let c = s[j]
                c.draw()
            }
        }

    }

    drawcanvas()

    //创建canvas2上的纸牌元素
    const newcard = function(c) {
        let number = c.number
        let char = c.char
        let icon = c.icon
        let color = c.color
        let dx = c.dx
        let dy = c.dy
        let open = c.open
        let c2 = new Card(number, char, icon, color, dx, dy, open)
        return c2
    }


    //创建canvas1上的纸牌集合movecard1
    let movecard1 = []
    //创建canvas2上的纸牌集合movecard2
    let movecard2 = []
    let enableDrag = false
    let i1 = 0
    let j1 = 0
    let x0 = 0
    let y0 = 0
    let x1 = 0
    let y1 = 0
    let click1 = false
    let click2 = false
    let click3 = false

    // mouse event canvas2监听鼠标点击拖拽
    canvas2.addEventListener('mousedown', function (event) {
        let x = event.offsetX
        let y = event.offsetY
        x0 = x
        y0 = y
        //log(x, y, 'down')
        let flag = 1
        if (haspoint4(x, y, 0) && cardLib.length !== 0) {
            click1 = true
            let c = cardLib[cardLib.length-1]
            context.fillStyle= '#408080CC'
            context.roundRect(dx0,dy0,w,h, r).fill();
            let c2 = newcard(c)
            movecard1.push(c)
            movecard2.push(c2)
            enableDrag = true
            x1 = x - movecard2[0].dx
            y1 = y - movecard2[0].dy
        } else
        //点到丢牌堆时
        if (DiscardLib.length !== 0  && haspoint4(x, y, 1)) {
            click2 = true
            let c = DiscardLib[DiscardLib.length-1]
            context.fillStyle= '#408080CC'
            context.roundRect(dx0+(w + l),dy0,w,h, r).fill();
            let c2 = newcard(c)
            movecard1.push(c)
            movecard2.push(c2)
            enableDrag = true
            x1 = x - movecard2[0].dx
            y1 = y - movecard2[0].dy

        }else {

            for (let i = 0; i < 7 * flag; i++) {
                let s = stacks[i]
                for (let j = 0; j < (s.length) * flag; j++) {
                    let c = s[j]
                    if (c.open && c.haspoint (x, y) && j === s.length - 1) {
                        click3 = true
                        //绘制阴影
                        context.fillStyle = '#408080CC'
                        context.roundRect (c.dx, c.dy, w, h, r).fill ();
                        //创建新的卡牌数组，准备在canvas2上绘图
                        let c2 = newcard (c)
                        movecard1.push (c)
                        movecard2.push (c2)
                        // 设置拖拽
                        enableDrag = true
                        i1 = i
                        j1 = j
                        x1 = x - movecard2[0].dx
                        y1 = y - movecard2[0].dy
                        flag = 0
                    } else if (c.open && c.haspoint2 (x, y) && j !== s.length - 1) {
                        click3 = true
                        //绘制阴影

                        context.fillStyle = '#408080CC'
                        context.roundRect (c.dx, c.dy, w, h + (s.length - 1 - j) * d, r).fill ();
                        //创建新的卡牌数组，准备在canvas2上绘图
                        for (let k = j; k < s.length; k++) {
                            let c2 = newcard (s[k])
                            movecard1.push (s[k])
                            movecard2.push (c2)
                        }
                        // 设置拖拽
                        enableDrag = true
                        i1 = i
                        j1 = j
                        x1 = x - movecard2[0].dx
                        y1 = y - movecard2[0].dy
                        flag = 0
                    }
                }
            }
        }

    })

    canvas2.addEventListener('mousemove', function (event) {
        let x = event.offsetX
        let y = event.offsetY
        //log(x, y, 'move')
        if (enableDrag) {
           //  update x y
            for (let i = 0; i < movecard2.length; i++) {
                movecard2[i].dx = x - x1
                movecard2[i].dy = y - y1 + d * i
            }
        }
    })

    canvas2.addEventListener('mouseup', function (event) {
        let x = event.offsetX
        let y = event.offsetY
        //log (x, y, 'up')
        //log('movecard1',movecard1)
        let flag = 1
        //当点击在发牌堆以外
        if (point(x, y, x0, y0) && !haspoint4(x, y, 0)) {
            //当点击丢牌堆时
            if (haspoint4(x, y, 1) && DiscardLib.length !== 0) {
                let c = DiscardLib[DiscardLib.length-1]
                flash(c)
            }else {
                //当点击stacks中每堆最后一张牌时
                for (let i = 0; i < 7 * flag; i++) {
                    let s = stacks[i]
                    if (s.length !== 0) {
                        let k = s.length - 1
                        let c = s[k]
                        if (c.haspoint(x, y)) {
                            flash2(i, k, c)
                            flag = 0
                        }
                    }
                    //当点击stacks中每堆非最后一张牌时
                    for (let j = 0; j < s.length * flag; j++) {
                         let c = s[j]
                        if (c.open && c.haspoint2 (x, y) && j !== s.length - 1) {
                            let cs = []
                            for (let k = j; k < s.length; k++) {
                                cs.push(s[k])
                            }
                            flash3(i, j, cs)
                            flag = 0
                        }

                    }
                }
            }
        //当原地点击发牌堆时
        }else if ((point(x, y, x0, y0) && haspoint4(x, y, 0)) ||
            (haspoint4(x, y, 1) && click1)) {
            if (cardLib.length !== 0) {
                let c = cardLib[cardLib.length-1]
                //log('c',c,cardLib)
                c.open =true
                c.dx = dx0 + (w + l)
                DiscardLib.push(c)
                if (DiscardLib.length > 1) {
                    let c1 = DiscardLib[DiscardLib.length-2]
                    c1.dx = dx0 + (w + l) + d1
                }
                if (DiscardLib.length > 2) {
                    let c1 = DiscardLib[DiscardLib.length-3]
                    c1.dx = dx0 + (w + l) + d1 * 2
                }
                cardLib.pop()
            }else if (cardLib.length === 0) {
                for (let i = DiscardLib.length-1; i >= 0; i--) {
                    DiscardLib[i].dx = dx0
                    DiscardLib[i].open = false
                    cardLib.push(DiscardLib[i])
                }
                DiscardLib = []
            }
            //从丢牌堆拖拽到发牌堆
        }else if (click2) {
            if (haspoint4(x, y, 0)) {
                let c = DiscardLib[DiscardLib.length - 1]
                c.dx = dx0
                c.open = false
                cardLib.push(c)
                DiscardLib.pop()
                DiscardLibreset()
            } else
                //从丢牌堆拖拽到花色堆
            if (haspoint4(x, y, 3) || haspoint4(x, y, 4) || haspoint4(x, y, 5) || haspoint4(x, y, 6)) {
                for (let i = 0; i < 4 * flag; i++) {
                    if (haspoint4(x, y, 3 + i)) {
                        if (suitpiles[i].length === 0 ) {
                            if (movecard1[0].number === 1) {
                                movecard1[0].dx = dx0 + (w + l) * (3 + i)
                                DiscardLib.pop ()
                                suitpiles[i].push (movecard1[0])
                                DiscardLibreset()
                                flag = 0
                            }
                        }else {
                            let s = suitpiles[i][suitpiles[i].length-1]
                            if (s.number === movecard1[0].number - 1 && s.icon === movecard1[0].icon) {
                                movecard1[0].dx = dx0 + (w + l) * (3 + i)
                                DiscardLib.pop ()
                                suitpiles[i].push (movecard1[0])
                                DiscardLibreset()
                                flag = 0
                            }
                        }
                    }
                }
                //从丢牌堆拖拽到stacks堆
            } else {
                for (let i = 0; i < 7 * flag; i++) {
                    let s = stacks[i]
                    //拖拽到空的stacks上
                    if (s.length === 0 && haspoint3 (x, y, i)) {
                        movecard1[0].dx = dx0 + (w + l) * i
                        movecard1[0].dy = (h + dy0 + dy1)
                        let s1 = DiscardLib
                        s1.pop ()
                        s.push (movecard1[0])
                        DiscardLibreset()
                        flag = 0
                    }
                    for (let j = 0; j < s.length * flag; j++) {
                        let c = s[j]
                        //判断拖拽是否可行
                        if (movecard1.length !== 0 &&
                            c.haspoint (x, y) &&
                            j === s.length - 1 &&
                            c.number === movecard1[0].number + 1 &&
                            c.color !== movecard1[0].color) {
                            //更新拖拽纸牌的坐标
                            movecard1[0].dx = c.dx
                            movecard1[0].dy = c.dy + d
                            //更新stacks
                            let s1 = DiscardLib
                            s1.pop ()
                            s.push (movecard1[0])
                            DiscardLibreset()
                            flag = 0
                        }

                    }
                }
            }
            //从stacks堆拖拽到花色堆
        }else if ((haspoint4(x, y, 3) || haspoint4(x, y, 4) || haspoint4(x, y, 5) || haspoint4(x, y, 6)) &&
            movecard1.length === 1 && click3) {
            for (let i = 0; i < 4 * flag; i++) {
                if (haspoint4(x, y, 3 + i)) {
                    if (suitpiles[i].length === 0 ) {
                        if (movecard1[0].number === 1) {
                            movecard1[0].dx = dx0 + (w + l) * (3 + i)
                            movecard1[0].dy = dy0
                            let s1 = stacks[i1]
                            s1.pop()
                            suitpiles[i].push (movecard1[0])
                            if(j1 > 0){
                                s1[j1-1].open = true
                            }
                            flag = 0
                        }
                    }else {
                        let s = suitpiles[i][suitpiles[i].length-1]
                        if (s.number === movecard1[0].number - 1 && s.icon === movecard1[0].icon) {
                            movecard1[0].dx = dx0 + (w + l) * (3 + i)
                            movecard1[0].dy = dy0
                            let s1 = stacks[i1]
                            s1.pop()
                            suitpiles[i].push (movecard1[0])
                            if(j1 > 0){
                                s1[j1-1].open = true
                            }
                            flag = 0
                        }
                    }
                }
            }
            //从stacks堆拖拽到stacks堆
        }else if (click3) {
            for (let i = 0; i < 7*flag; i++) {
                let s = stacks[i]
                //当拖拽到空的stacks时
                if (s.length === 0 && haspoint3(x, y, i)) {
                    for (let k = 0; k < movecard1.length; k++) {
                        movecard1[k].dx = dx0 + (w + l) * i
                        movecard1[k].dy = (h + dy0 + dy1) + d * k
                    }
                    let s1 = stacks[i1]
                    for (let k = 0; k < movecard1.length; k++) {
                        s1.pop()
                        s.push(movecard1[k])
                    }
                    if(j1 > 0){
                        s1[j1-1].open = true
                    }
                    flag = 0
                }
                for (let j = 0; j < s.length*flag; j++) {
                    let c = s[j]
                    //判断拖拽是否可行
                    if ( movecard1.length !== 0 &&
                        c.haspoint(x, y) &&
                        j === s.length - 1 &&
                        c.number ===  movecard1[0].number+1 &&
                        c.color !==  movecard1[0].color) {
                        //更新拖拽纸牌的坐标
                        for (let k = 0; k < movecard1.length; k++) {
                            movecard1[k].dx = c.dx
                            movecard1[k].dy = c.dy + d * (k + 1)
                        }
                        //更新stacks
                        //log(i1,j1)
                        let s1 = stacks[i1]
                        for (let k = 0; k < movecard1.length; k++) {
                            s1.pop()
                            s.push(movecard1[k])
                        }
                        if(j1 > 0){
                            s1[j1-1].open = true
                        }
                        flag = 0
                    }

                }
            }
        }
        enableDrag = false
        click1 = false
        click2 = false
        click3 = false
        movecard2 = []
        h1 = h
        movecard1 = []
        //重新绘制canvas1，清空canvas2
        context2.clearRect(0, 0, 795, 750)
        drawcanvas()
    })
    //设置canvas2上的动画刷新帧数
    setInterval(function () {
        if(movecard2.length !== 0 && enableDrag) {
            //clear
            context2.clearRect(0, 0, 795, 750)
            //draw
            for (let i = 0; i < movecard2.length; i++) {
                movecard2[i].draw2()
            }
        }
    }, 1000 / 60)

}

__main()


