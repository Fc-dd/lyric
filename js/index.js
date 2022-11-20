/**
 * 将歌词转成对象
 * @param {*} str 
 */
function parseStr (str) {
  let newStr =  str.split(/\n/)
  let result = []
  let obj,time,words
  newStr.forEach(item => {
    time = parseTime(item.split(']')[0].substr(1))
    words = item.split(']')[1]
    obj = {
      time,
      words
    }
    result.push(obj)
    obj = null
  });
  return result
}

/**
 * 将时间格式转为秒数
 * @param {*} time 
 */
function parseTime (time) {
  const newStr = time.split(':')
  return newStr[0]*60 + +newStr[1]
}

/**
 * 根据时间返回歌词索引
 * @param {*} time 
 */
function findIndex (data, time) {
  let index
  data.some((item, i) => {
    if (time < item.time) return index = i - 1
  })
  // index为undefined说明到了最后一句
  if (index == undefined) index = data.length - 1
  return index
}

// 创建歌词元素li
function creatLi (data) {
  let frag = document.createDocumentFragment() // 创建文档片段
  data.forEach(item => {
    let li = document.createElement('li')
    li.textContent = item.words
    frag.appendChild(li)
  })
  doms.ul.appendChild(frag)
}

// 获取dom元素
const doms = {
  container: document.querySelector('.container'),
  audio: document.querySelector('audio'),
  ul: document.querySelector('ul')
}

let LrcData = parseStr(lrc) // 处理后的歌词对象
creatLi(LrcData) // 生成dom

// 获取高度
let liHeight = doms.ul.children[0].offsetHeight
let containerHeight = doms.container.offsetHeight

// ul 最大偏移量(触底的时候就不走了)
let maxOffset = doms.ul.offsetHeight - containerHeight

/**
 * 设置ul的偏移量
 */
function setUloffset () {
  let curTime = doms.audio.currentTime
  let index = findIndex(LrcData, curTime)
  /* ul偏移量 = li高度 * 当前li的索引 + li高度的一半 - 盒子高度的一半
     值为负值时说明歌词还没有走到中间 ul不动
     大于偏移量时说明到最后了也不动
  */
  let offset = index * liHeight + liHeight / 2 - containerHeight / 2
  if (offset < 0) offset = 0
  if (offset > maxOffset)  offset = maxOffset
  doms.ul.style.transform = `translateY(-${offset}px)`

  // 给当前li加上active样式
  let preLi = doms.ul.querySelector('.active')
  if (preLi) preLi.classList.remove('active')
  if (doms.ul.children[index]) doms.ul.children[index].classList.add('active')
}

// 监听 audio 播放
doms.audio.addEventListener('timeupdate', setUloffset)
