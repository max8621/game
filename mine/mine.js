const fyShuffle = function(arr){
    let _arr=arr.concat();
    for(let i =_arr.length-1;i>0; i--){
        let ind=Math.floor(i*Math.random());
        [_arr[i], _arr[ind]] = [_arr[ind], _arr[i]];
    }
    return _arr;
}

const square0 = function() {
    let s0 = [9, 0, 0, 0, 0, 0, 0, 0, 0];
    let s00 = [9, 9, 0, 0, 0, 0, 0, 0, 0];
    s1 = fyShuffle(s0)
    s2 = fyShuffle(s0)
    s3 = fyShuffle(s0)
    s4 = fyShuffle(s0)
    s5 = fyShuffle(s0)
    s6 = fyShuffle(s0)
    s7 = fyShuffle(s00)
    s8 = fyShuffle(s0)
    s9 = fyShuffle(s0)
    s = [s1, s2, s3, s4, s5, s6, s7, s8, s9]
    return s
}


const plus1 = function(array, x, y) {
    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

const markAround = function(array, x, y) {
    if (array[x][y] === 9) {

        plus1(array, x - 1, y - 1)
        plus1(array, x, y - 1)
        plus1(array, x + 1, y - 1)

        plus1(array, x - 1, y)
        plus1(array, x + 1, y)

        plus1(array, x - 1, y + 1)
        plus1(array, x, y + 1)
        plus1(array, x + 1, y + 1)
    }
}

const markedSquare = function(array) {
    let square = array
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}

let array = square0()

let square = markedSquare(array)

const log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错`
        alert(s)
        return null
    } else {
        return element
    }
}
const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `选择器 ${selector} 写错`
        alert(s)
        //
        return []
    } else {
        return elements
    }
}
const bindAll = function(elements, eventName, callback) {
    for (let i = 0; i < elements.length; i++) {
        let tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}

const templateCell = function(line, x) {
    let c =''
    for (let i = 0; i < line.length; i++) {
        // let c1 = line[i]
        let c2 = '<div class="cell" data-number="' + line[i] + '" data-x="' + x + '" data-y="' + i + '">'+ line[i] + '</div>'
        c += c2
    }
    return c
}

const templaterow = function(square) {
    let d = ''
    // let d1 = square.length
    for (let i = 0; i < square.length; i++) {
        let row = templateCell(square[i], i)
        d += row
    }
    return d
}

const renderSquare = function(square) {
    let row = templaterow(square)
    let div = e('#bottom')
    div.innerHTML += row
}


const bindEventDelegate = function(square) {

    let ds = es('div[data-number = "0"]')
    for (let i = 0; i < ds.length; i++) {
        let e2 = ds[i]
        e2.style.fontSize = "0px";
    }
}
//const bindEventDelegate = function() {
//    let id = es(`.(div[data-number ="9"])`)
//    for (let i = 0; i < id.length; i++) {
//        let e = id[i]
//        e.insertAdjacentHTML('afterbegin', '<img class="picture" src="boom.png" alt="flag">')
//    }
//}




const flag = function() {
    let bs = es('.cell')
    bindAll(bs,'contextmenu', function(event) {
        let self = event.target
        if (self.classList.contains('pictureflag')) {
            event.preventDefault();
            self.remove('<img class="pictureflag" src="flag.png" alt="flag">')
        } else {
            self.insertAdjacentHTML('afterbegin', '<img class="pictureflag" src="flag.png" alt="flag">')
            event.preventDefault();
        }
    })
}



const vjkl = function(square) {
    let bs = es('.cell')
    bindAll(bs,'click', function(event) {
        let self = event.target
        //let id = self.dataset.number
        let i = Number(self.dataset.number)
        if (i === 9) {
            for (let i = 0; i < bs.length; i++) {
                let e = bs[i]
                e.classList.add('open')
            }
            let cs = es('div[data-number = "9"]')
            for (let i = 0; i < cs.length; i++) {
                let e1 = cs[i]
                e1.style.fontSize = "0px";
                if (e1.classList.contains('pictureflag')) {
                    e1.remove('<img class="pictureflag" src="flag.png" alt="flag">')
                }
                e1.insertAdjacentHTML('afterbegin', '<img class="picture" src="mine.png" alt="mine">')
            }
            alert('GAME OVER')

        } else if (i === 0) {
            self.style.opacity = "90"
            self.classList.add('open')
            let x = self.dataset.x
            let y = self.dataset.y
            x = Number(x)
            y = Number(y)
            vjklAround(square, x, y)
            self.style.fontSize = "0px"
        } else {
            self.classList.add('open')
            self.style.opacity = "90"
            self.style.fontSize = "30px"
        }
    })
}

const vjklAround = function(square, x, y) {
    vjkl1(square, x - 1, y - 1)
    vjkl1(square, x, y - 1)
    vjkl1(square, x + 1, y - 1)
    vjkl1(square, x - 1, y)
    vjkl1(square, x + 1, y)
    vjkl1(square, x - 1, y + 1)
    vjkl1(square, x, y + 1)
    vjkl1(square, x + 1, y + 1)
}
const judge = function (line, number) {
    for (let i = 0; i < line.length; i++) {
        if(number === line[i]) {
            return false
        }
    }
    return true
}


const vjkl1 = function(square, x, y) {
    let n = square.length
    let line = []
    if (x >= 0 && x < n && y >= 0 && y < n) {
        let id = e(`div[data-x = "${x}"][data-y = "${y}"]`)
        let num = `${x}${y}`
        // log('num', num)
        if(!id.classList.contains('open') && judge(line, num)){
            let i = Number(id.dataset.number)
            log('i',i)
            if(i === 0){
                line.push(num)
                id.classList.add('open')
                id.style.fontSize = "0px"
                vjklAround(square, x, y)
            } else if(i !== 9){
                line.push(num)
                id.classList.add('open')
            }
        }
    }
}


const __main = function() {
    renderSquare(square)
    bindEventDelegate(square)
    vjkl(square)
    flag()
}
__main()