module.exports = {
    getIndex  : async (req, res) => {
        try {
            res.render('index.ejs', { title : 'Home Page'})
        } catch (error) {
            console.error(error)
        }
    },

    getIvest :  async (req, res) => {
        try {
            res.render('invest.ejs', { title : "Invest In Us"})
        } catch (error) {
            console.error(error)
        }
    }
}