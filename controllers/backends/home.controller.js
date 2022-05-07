const moment = require('moment');
const { OrderByDate } = require('../../helpers/orderByDate');
class HomeController {
  async index(req, res) {
    try {
      const date = new Date();
      const today = moment(date).format('YYYY-MM-DD');
      const sau1ngay = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
      const sau2ngay = moment(date).subtract(2, 'days').format('YYYY-MM-DD');
      const sau3ngay = moment(date).subtract(3, 'days').format('YYYY-MM-DD');
      const sau4ngay = moment(date).subtract(4, 'days').format('YYYY-MM-DD');
      const sau5ngay = moment(date).subtract(5, 'days').format('YYYY-MM-DD');
      const sau6ngay = moment(date).subtract(6, 'days').format('YYYY-MM-DD');
      const sl_today = await OrderByDate(today, moment(date).add(1, 'days').format('YYYY-MM-DD'));
      const sl_sau1ngay = await OrderByDate(sau1ngay, today);
      const sl_sau2ngay = await OrderByDate(sau1ngay, sau2ngay);
      const sl_sau3ngay = await OrderByDate(sau2ngay, sau3ngay);
      const sl_sau4ngay = await OrderByDate(sau3ngay, sau4ngay);
      const sl_sau5ngay = await OrderByDate(sau4ngay, sau5ngay);
      const sl_sau6ngay = await OrderByDate(sau6ngay, moment(date).subtract(7, 'days').format('YYYY-MM-DD'));
      return res.render('./backends/homeView', {
        today: today,
        sau1ngay: sau1ngay,
        sau2ngay: sau2ngay,
        sau3ngay: sau3ngay,
        sau4ngay: sau4ngay,
        sau5ngay: sau5ngay,
        sau6ngay: sau6ngay,
        sl_sau6ngay: sl_sau6ngay.length,
        sl_sau5ngay: sl_sau5ngay.length,
        sl_sau4ngay: sl_sau4ngay.length,
        sl_sau3ngay: sl_sau3ngay.length,
        sl_sau2ngay: sl_sau2ngay.length,
        sl_sau1ngay: sl_sau1ngay.length,
        sl_today: sl_today.length,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new HomeController;