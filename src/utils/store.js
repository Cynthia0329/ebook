// import { getLocalStorage, getBookShelf, saveBookShelf } from './localStorage'
import { getBookShelf, saveBookShelf } from './localStorage'

// 添加图书到书架中
export function addToShelf(book) {
  // 从本地中读取书架中的图书列表（包含默认和分类中的所有图书）
  let shelfList = getBookShelf()
  shelfList = removeAddFromShelf(shelfList)
  // 设置新添加的图书为默认图书
  book.type = 1
  shelfList.push(book)
  // ？？？
  shelfList = computeId(shelfList)
  // 将...添加到书架上
  shelfList = appendAddToShelf(shelfList)
  // 重新保存本地中的shelfList数组
  saveBookShelf(shelfList)
}

// 导入一本图书到书架中
export function importShelf(fileName) {
  // 从本地中读取书架中的图书列表（包含默认和分类中的所有图书）
  let shelfList = getBookShelf()
  shelfList = removeAddFromShelf(shelfList)
  // 设置新添加的图书为默认图书。缓存状态为真
  let bookImport = {
    type: 4,
    cache: true,
    selected: false,
    fileName: fileName,
    title: fileName
  }
  shelfList.push(bookImport)
  shelfList = computeId(shelfList)
  // 将...添加到书架上
  shelfList = appendAddToShelf(shelfList)
  // 重新保存本地中的shelfList数组
  saveBookShelf(shelfList)
  return shelfList
}

// 将图书从书架移除
export function removeFromBookShelf(book) {
  return getBookShelf().filter(item => {
    if (item.itemList) { // ???
      item.itemList = removeAddFromShelf(item.itemList)
    }
    return item.fileName !== book.fileName
  })
}

// 修改数组的id值(id值比index值大1)
export function computeId(list) {
  return list.map((book, index) => {
    if (book.type !== 3) {
      book.id = index + 1
      if (book.itemList) {
        book.itemList = computeId(book.itemList)
      }
    }
    return book
  })
}

// 进入书籍详情页的方法
export function gotoBookDetail(vue, book) {
  // vue.$router.push() 在history栈中添加一条新的记录。
  vue.$router.push({
    path: '/store/detail',
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}

// 进入书城首页
export function gotoStoreHome(vue) {
  // vue.$router.push() 在history栈中添加一条新的记录。
  vue.$router.push({
    path: '/store/home'
  })
}

// 添加type为3到shelfList数组中
export function appendAddToShelf(shelfList) {
  shelfList.push({
    id: -1,
    type: 3
  })
  return shelfList
}

// 过滤图书列表，得到书架上默认和分组中的所有图书（移除type为3）
export function removeAddFromShelf(list) {
  if (!list) {
    return []
  }
  return list.filter(item => item.type !== 3)
}

// 图书分类的名字列表
export const categoryList = {
  'ComputerScience': 1,
  'SocialSciences': 2,
  'Economics': 3,
  'Education': 4,
  'Engineering': 5,
  'Environment': 6,
  'Geography': 7,
  'History': 8,
  'Laws': 9,
  'LifeSciences': 10,
  'Literature': 11,
  'Biomedicine': 12,
  'BusinessandManagement': 13,
  'EarthSciences': 14,
  'MaterialsScience': 15,
  'Mathematics': 16,
  'MedicineAndPublicHealth': 17,
  'Philosophy': 18,
  'Physics': 19,
  'PoliticalScienceAndInternationalRelations': 20,
  'Psychology': 21,
  'Statistics': 22
}

// 通过id号 得到图书分类的名字列表 方法
export function getCategoryName(id) {
  switch (id) {
    case 1:
      return 'ComputerScience'
    case 2:
      return 'SocialSciences'
    case 3:
      return 'Economics'
    case 4:
      return 'Education'
    case 5:
      return 'Engineering'
    case 6:
      return 'Environment'
    case 7:
      return 'Geography'
    case 8:
      return 'History'
    case 9:
      return 'Laws'
    case 10:
      return 'LifeSciences'
    case 11:
      return 'Literature'
    case 12:
      return 'Biomedicine'
    case 13:
      return 'BusinessandManagement'
    case 14:
      return 'EarthSciences'
    case 15:
      return 'MaterialsScience'
    case 16:
      return 'Mathematics'
    case 17:
      return 'MedicineAndPublicHealth'
    case 18:
      return 'Philosophy'
    case 19:
      return 'Physics'
    case 20:
      return 'PoliticalScienceAndInternationalRelations'
    case 21:
      return 'Psychology'
    case 22:
      return 'Statistics'
  }
}

// 得到图书分类的名字列表对应的国际语言文字
export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.computerScience')
    case 2:
      return vue.$t('category.socialSciences')
    case 3:
      return vue.$t('category.economics')
    case 4:
      return vue.$t('category.education')
    case 5:
      return vue.$t('category.engineering')
    case 6:
      return vue.$t('category.environment')
    case 7:
      return vue.$t('category.geography')
    case 8:
      return vue.$t('category.history')
    case 9:
      return vue.$t('category.laws')
    case 10:
      return vue.$t('category.lifeSciences')
    case 11:
      return vue.$t('category.literature')
    case 12:
      return vue.$t('category.biomedicine')
    case 13:
      return vue.$t('category.businessandManagement')
    case 14:
      return vue.$t('category.earthSciences')
    case 15:
      return vue.$t('category.materialsScience')
    case 16:
      return vue.$t('category.mathematics')
    case 17:
      return vue.$t('category.medicineAndPublicHealth')
    case 18:
      return vue.$t('category.philosophy')
    case 19:
      return vue.$t('category.physics')
    case 20:
      return vue.$t('category.politicalScienceAndInternationalRelations')
    case 21:
      return vue.$t('category.psychology')
    case 22:
      return vue.$t('category.statistics')
  }
}
