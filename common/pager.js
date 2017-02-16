/**
 * Created by Administrator on 2017/2/12.
 */
'use strict';

function Pager(pager){
    this.currentPage = pager.currentPage;
    this.totalPages = pager.totalPages;
    this.url = pager.url;
    this.keyWord = pager.keyWord;
};

module.exports = Pager;