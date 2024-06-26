const express = require('express')
const router = express.Router()
const { checkAdmin } = require('../middlewares/auth')
const Category = require('../models/categories.model')

router.get('/add-category', checkAdmin, (req, res) => {
    res.render('admin/add-category')
})

router.post('/add-category', checkAdmin, async (req, res, next) => {
    try {
        const title = req.body.title;
        const slug = title.replace(/\s+/g, '-').toLowerCase();
        // 제목 입니다. 제목-입니다. 로 만들어준다.
        const category = await Category.findOne({ slug: slug });
        // slug에 같은 title + slug가 있는지 찾는다.
        if (category) {
            req.flash('error', '이미 존재하는 카테고리입니다.');
            res.redirect('back');
        }

        const newCategory = new Category({
            title,
            slug
        })
        
        await newCategory.save();

        req.flash('success', '카테고리가 생성되었습니다.');
        res.redirect('/admin/categories')
    } catch(error) {
        console.error(error);
        next(error);
    }
})

router.get('/', checkAdmin, async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.render('admin/categories', { categories: categories });
    } catch(error) {
        console.error(error);
        next(error);
    }
})

router.delete('/:id', checkAdmin, async (req, res, next) => {
    try{
        const { id } = req.params;
        await Category.findByIdAndDelete(id);

        req.flash('success', '카테고리가 삭제되었습니다.')
        res.redirect('back')
    } catch(error) {
        console.error(error);
        next(error);
    }
})



module.exports = router