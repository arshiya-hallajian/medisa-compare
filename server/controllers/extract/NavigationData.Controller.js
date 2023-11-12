const navbarModel = require('../../models/navbar.model')
const navbar_main_number = require('../../modules/navScrap.modules')
const axios = require('axios')
const cheerio = require('cheerio');


module.exports.NavbarUpdateController = async (req,res) => {
    let fixed_nav_menu;
    try {
        const res = await axios.get(`https://store.independenceaustralia.com`, {
            maxBodyLength: Infinity,
            timeout: 30000
        });
        const $ = cheerio.load(res.data);


        //main navigation href
        const navhrefScrap = $("#ms-topmenu > li").children('a');
        const navhref = [] //main navigation href array
        navhrefScrap.each((i, elm) => {
            // console.log(elm.attribs.href)
            navhref.push("https://store.independenceaustralia.com" + elm.attribs.href)
        })


        const nav = $("#ms-topmenu > li").children('a').text();
        const navarr = nav.split('\n');
        navarr.forEach((val, index, arr) => {
            arr[index] = val.trim()
        })
        fixed_nav_menu = navarr.filter(item => item)


        const FData = [];

        for (let i = 0; i < fixed_nav_menu.length; i++) {
            const total = await navbar_main_number(navhref[i])
            FData.push({
                name: fixed_nav_menu[i],
                submenu: [],
                link: navhref[i],
                total: total
            })
        }


        const submenuPromises = FData.map(async (element) => {
            let submenu;
            if (element.name === "Other") {
                submenu = $(`#ms-topmenu > li:last-of-type .col-level > div > a`);
            } else {
                submenu = $(`#ms-topmenu > li:contains(${element.name}) .col-level > div > a`);
            }
            const submenuData = [];

            submenu.each((i, el) => {
                submenuData.push({
                    name: el.attribs.title,
                    link: el.attribs.href
                });
            });

            await Promise.all(submenuData.map(async (item) => {
                item.number = await navbar_main_number(item.link);
            }));

            element.submenu = submenuData;
        });

        await Promise.all(submenuPromises);


        const existingNavbar = await navbarModel.find({});
        if (existingNavbar.length > 0) {
            await navbarModel.deleteMany({});
        }
        const savedNavbar = await navbarModel.create(FData);
        console.log(savedNavbar)


    } catch (e) {
        console.log(e, "navigation error");
        res.send(e);
    }
}


module.exports.NavbarDataController = async (req,res)  => {
    try{
        const resp = await navbarModel.find();

        res.send({
            navbar: resp
        })
    }catch(e){
        console.log(e, "navigation get data error")
        res.send(e)
    }

}