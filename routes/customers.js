var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models, event) {
    'use strict';

    var handler = new CustomerHandler(models, event);
    var moduleId = MODULES.COMPANIES;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'person', event);
    }

    router.use(authStackMiddleware);

    /**
     *@api {get} /customers/ Request Customers
     *
     * @apiVersion 0.0.1
     * @apiName getCustomers
     * @apiGroup Customers
     *
     * @apiSuccess {Object} Customers
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
   data: [
     {
       _id: "55ba0301d79a3a343900000d",
       __v: 0,
       channel: null,
       integrationId: "",
       companyInfo: {
         size: "574c54ec83569c287bf59583",
         industry: "574c54e22b7598157b94f1a5"
       },
       editedBy: {
         date: "2016-05-31T18:54:27.587Z",
         user: "57231ce22387d7b821a694c2"
       },
       createdBy: {
         date: "2015-07-30T10:57:05.119Z",
         user: "55ba00e9d79a3a343900000c"
       },
       history: [

       ],
       attachments: [

       ],
       notes: [

       ],
       groups: {
         group: [

         ],
         users: [

         ],
         owner: "55b9fbcdd79a3a3439000007"
       },
       whoCanRW: "everyOne",
       social: {
         LI: "https://www.linkedin.com/company/hashplay-inc",
         FB: ""
       },
       color: "#4d5a75",
       relatedUser: null,
       salesPurchases: {
         receiveMessages: 0,
         language: "English",
         reference: "",
         active: false,
         implementedBy: null,
         salesTeam: null,
         salesPerson: null,
         isSupplier: false,
         isCustomer: false
       },
       title: "",
       internalNotes: "",
       contacts: [

       ],
       phones: {
         fax: "",
         mobile: "",
         phone: ""
       },
       skype: "",
       jobPosition: "",
       website: "hashplay.net",
       shippingAddress: {
         name: "",
         country: "",
         zip: "",
         state: "",
         city: "",
         street: ""
       },
       address: {
         country: "United States",
         zip: "94107",
         state: "California",
         city: "San Francisco",
         street: "350 Townsend St. 755"
       },
       timezone: "UTC",
       department: null,
       company: null,
       email: "contact@hashplay.tv",
       imageSrc: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAoqnqur6XoVhLqms6jb2NnAN0k9xIERR7k8V85fEb9tLQNLM2m/DrSDqtwpKC/u8x24PqqffcfXb+NceLx+HwMeavK3l1+487MM2weVw5sVNLsur9FufTNZmq+J/DWhR+brfiHTNPT+9dXccQ/NiK/PLxh8e/ix43Zl1fxhew254+zWLfZosehCYLf8CJpfD3wL+MXjaCLVNK8HahcW9yokjubmRIUkUjIYNKw3A+ozXgS4mdaXJhKLl/XZXPkZ8cSxE3Ty/DSm/66JP8z7pm+NvwhgcpJ8SfD2R/dv42/katWHxa+F2puIrH4h+HZXY4CDUoQxPsC2a+OYP2O/jPMgaSz0iAn+GS/BI/75BFVNS/ZK+N1gheHw7aXwAyfs1/Dn8nZSaP7YzRavDO3ow/1jz6PvSwLt6S/r8D74gura6QSWtxFMhGQ0bhgR9RUtfmVqmlfEv4V6jDFqMWueG7t8tCVleAuB1KMpww5HQ969H8E/te/FHwy8MGvy2/iOyTAZLpRHOV9pVHX3YNV0eJ6PNyYmm4P7/v2f4GmG46w/tPZY2lKm/vt6qyf4M+7qK8t+GX7Rnw5+JhSxtL86XqrYH2C+IR3P8A0zb7r/QHPtXqVfRUMRSxMPaUZJryPssLjKGNpqrh5qUe6CiiitjpCiiigAooooAK4D4ufGbwr8ItH+2axL9p1G4U/Y9OiYebOemT/dQHqx/DJ4p3xk+LOjfCPwpJrV7snv58xafZ7sGeXHfHIQdWP0HUivhfT9O+IX7QPxCcK76hquoOZJppDiG1hHc9kRRwAPYDJNeDm+bvCNYfDrmqy/D/AIPZHyfEXEMsvaweDXNXlst7X2079l83pvN42+IvxH+O3iaG1uRcXjzTEWGk2asYoif7qdzjOWPPXkCuAkjaKRonA3ISpwc8j3r7sf4ceF/2dvg14k1bRcS60umyLNqki4lkmcbEC/3FDMMKPxyea+Ea+OzXB1cLKLxEuapLV+Xb9fLsfm2f5dXwE4Sxk+atNOUutlslfq9/Logr9S/Cumf2L4Y0jR8Y+w2FvbY/3I1X+lfmf4G01dY8aaDpTruW71K2hYeqtIoP6V+nN5rOkadn+0NVs7bHJ86dU/ma9zhOCSq1H5L8z6rw+pqKr15f3V+bf6Fyiufl+IPgOBts3jXQkPo2owj/ANmqa38a+DrsgWvivR5iegS+ibP5NX1/tqbduZfefoqxFFuymvvR88/tz6QJdA8La6Bza3dxaE+0qKw/9FH86+P6+5f2x7eHU/g9HqFtJHMlnqlvJvRgwwwdOo92FfDVfnnEkFHHuS6pP8LfofjnGtJQzaUl9pRf4W/Qu6fpGrajBd3umWU86adGLi5eJSTDHuA3nHIUEgZ6DIr6D+B/7WOr+HJbfwz8SbibUtKZgkWosS9xajoN/eRB/wB9DnrwK4z9lXXo9F+Mml2twy/Z9Yhn06UN91t6blU+uWRR+NeqftD/ALLcKw3fjr4Z2WwpumvtJjHGOpkgHbuSn/fPpRl1DFUqH17BS1i7Sj3W/wA/z7DyXCY+hhHmmWTvKLanHulZ7dVZ7b9UfU+n6jY6tYwanpl3FdWl1GJYZomDJIhGQQR1FWK+EP2cvj/efDTVo/DHiW5kl8M3smG3ZY2Mh/5aL/sZ+8v4jnr92QzRXEKXEEqyRSqHR1OVZSMgg9wRX2uWZlTzKlzx0kt12/4B+m5HndHO8P7WGkl8S7P/ACfQfRRRXpHthVbUdQs9J0+51TUZ1gtbSJ55pG6IijLE/QCrNfOf7ZvxDfQfCFn4F065KXWvOZLoKeRaxkcH03Pge4VhXJjsVHBYeVeXRfj0/E8/NMfDLMHUxU/srTzeyX3nzZ8V/iJrXxq+ILahEsv2eSUWmlWbsB5URbCg84DMTljnv1wBX0r8MPE/wI/Z+8JLpl3440281u6US6nPZA3LySgcRqYwcIuSBk+p718U0V+c4XNamGrSxPKpVJdX09F/Wh+L4DP62BxM8a4KdWX2pX0vvZK357aH0h+0B+094f8AiV4Ql8F+EdK1KCKe7jkuLm7VEEkSEsFVVYnlwhyccDpzXzfRRXLjMbVx1X2tZ67HDmWZ4jNa/wBYxLvK1u2g+Gaa3lSe3leKSMhkdGKspHQgjoaJZ552LzTPIzHJLMSSfxplFct+hwXdrBQCRyKKKAJhe3iwPbLdzCGXG+MSHa2DkZHQ4NQ0UUXuDbe5oeHdYm8PeINM1+3BMum3kN2gBxlo3DD+VfbXhn9sf4Ta2RDrI1PQpeObq38yIn2aIsfzUV8K0V6WX5riMtuqNrPdM9rKM/xmS8yw9mpbpq+33M9y/aN8I+ALu9PxH+F3iDS76xv5M6lZ2twpe3mY8SiP7wRj144b/e49R/Y8+ME2sWL/AAv1+5aS60+IzaXLI+S8A+9Dz/c6j/ZyOi18eVreEvE2o+DvE2m+KNKkK3Wm3CTpg43AHlT7MMg+xNbYbNfYY1YqEeVP4ktvP/P1OnBZ+8Lmix9OHIpfFFbNPe3bvbufqVRWb4b1/T/FWgaf4k0mQvaalbpcwk9QrDOD7jofcVpV+mRkpJSjsz9whOM4qUXdMK/PD9pbxcPF/wAYdcmifdbaZINMg57Q/K/5ybzX6E3k4tbSe5Y4EUbOT9Bmvzd+GdgfGfxi0K2uVEq6jrSTzBhncvmeY+fXgGvl+J5ynGlho/bf+S/U+E45qTqQw+Bh/wAvJflZL/0o5LT9I1bVpPK0rTLu8f8Au28LSH8lBrpbH4O/FTUtv2P4e68+7oTYyKPzYCv0thhht4xFBEkaDoqKAB+ApXdY0aRzhVBJPsKxhwlTXx1W/RW/VnPS8PaKX72u36JL82z8qtU0y+0XUrrSNUtmt7yymeCeJiMxyKcMpxxkEEVWrQ8RalJrHiDU9Xm/1l9eTXLfV3LH+dZ9fFTSUmo7H5jUUVNqG19D0n4H/BqX4za5f6QuvLpKafbC4eU23nFssFAC7l/nXu1r+wtoKKPt3xCv5T38qxSMfqzVh/sLW4bWfFl1t5S1tYwf953P/std7+2J4r8S+FPCGgXHhrWrzTJZdVPmS2spjZgsTEKSOozzjpwK+uwGBwUMs+u4inzNX6vvbvY/Q8pyvLKWR/2njKPO1e+r/mt3sZqfsOeBAPn8Ya8T7CEf+yVHN+w34MYfuPGutIf9uKJv5AVgfCP9siWLyND+K0JkQAImr20fzZ7GaMdf95R/wE9a+ptE17RvEmmw6xoGqW1/ZXC7o57eQOrD6jv7dRXp4LCZPmEL0YK/bW6/E9zLMBw5m9Pmw1NX6ptqS9Vf8Vp5nzDf/sK2+13034jyggZVJtMByfdhKP5V8nTRtDK8LdUYqfqDX6vV+W3jC1Nj4t1uxPW31G5i/wC+ZWH9K8XiLLsPgVTlh42ve+r8rbnzPGeS4PK40Z4SHLzc19W+1t2/MyK6Dwz8P/GnjK2urvwr4bvdVismRLg2qbzGWztyo55we3aufr6e/YYv2j8ReKdM3fLPZW8+M9SjsP8A2c14mW4aGMxUaE3ZO+3ofMZLgaeZY6nharaUr6rfZtHgWofDzx7pKl9S8F63bKvVpLCUKPx24rn2RkYo6lWU4IIwQa/V+vGf2sfDVrq/wb1bUVtI2u9Mlt7tJAg3gCVUbnrja5P4V9BjOGFQoyrU6l+VN2a7ed/0Pr8y4FjhMNUxFGs3ypuzjvZX3v8AoY/7Gfi+TXfhpceHLmTdN4fvGij9fIkG9PybzB9AK9+r40/Yc1kweM/EOgFvlvNNW6A/2opQv8pT+VfZdfQZDXdfAU291p9234H1/CeKeKymk5PWN4/c7L8LGD49leDwL4jnjJDx6TeOpHqIWIr4R/ZcjSX46+GFccBrph9RaykV99+IrEan4f1PTW6XdnNAf+BIR/Wvz3/Z4vxo/wAbfCs0x2ZvmtTn1ljePH5vXmZ97uOwsntf9UeHxX7ma4CpLbmX4SifozVLWnaPR7+RfvLbSsPqENXahvYPtNnPbYz5sTJ+YIr6qSumfezTcWkflNIcuxPcmkqS6jaG6mhdSrJIykHsQajr8bZ/Nj0Z9YfsJKMeNX7g6eP/AEoroP24lB+H+gt3Gsgf+QJP8K5n9hOfF14xtv78dk/5GYf+zV0X7ccmPA/h6L+9qzN+ULf419tSa/1efo//AEo/UMO1/qc/R/8ApbPjOum8DfEjxn8OdSGp+Etcns2J/eQ53QzD0eM/K31xkdiKb4H+HfjD4jap/ZPhHRpr2RcGWQfLFCp7u54Ufqe2a+ufhZ+yD4R8KeXqvjuSLxFqQAItypFnE3sp5k+rcf7NfPZbluMxc1PD+6l9ra39eR8dkmSZjmNRVcJeKX29kvR7v5fM7r4EfFHV/it4O/t3WvDkul3EMnkmQA+RdcZ8yLPOOxHOD3Pb4K+JAA+InigDtrV7/wCj3r9O4YYbeJILeJIoo1CIiKAqqOAAB0FfmB8QJUn8eeJJ42ysmr3jqfUGZzXu8SwnTw1GFSXNJXu9rn1XG9OpRwWGp1p88k3d2tfRdDBr6L/YhJ/4WJrS9jpDH/yNHXzpX0l+w7bF/HPiC67RaWqfi0q//E14OSK+YUvX9GfKcLq+b0Ld/wBGfZ1cN8cYUn+D/jBJBkDSLhvxVCR+oFdzXmv7R+qppHwT8VXDNgzWi2q+5lkWP+TGv0jGtRw1Rv8Alf5H7TmclDBVpS2UJfkz5c/Y1kZPjIFXpJpVyp+mUP8AQV9218P/ALFOnvc/FW/vgPks9GmJOP4mliUD8t35V9wV4/DCawOvd/ofOcDRayq76yl+ghAYEEcHg1+anjax1D4afFzVIYE23Giay1xbbxwyiTzIifYqVP41+llfGn7a/gabTvFWmePbaPNtq0As7ggfdniHyk/7yEY/3DUcT4eVTDRrx3g/wf8AwbGfHOElVwMcVT3pyv8AJ6fnYs6b+3R4hiI/tfwBp1yO/wBmvHh/9CV67DTf24fA06r/AGp4Q1q0c/e8l4plH4kqT+VfGNFfMU+Icwp/bv6pf5HwtHjDOKW9W/ql/lc1vF9/puqeK9Z1PRlkWwvL+4uLZZFCusTyMyggEgEAismiivGlJzk5PqfNzm6knN9T6P8A2Kdd03SPFfiK31PUra0S5sIinnyrGHZZOgyeThq+mfiB4H+H3xc0uz0nxJeR3VtZ3Qu4/st4qsWClSpKn7pDHOPQc1+a9OWWVfuyMPoa97BZ4sLhfqtSkpx1693fsz63K+Ko4DArAVqCqQ13e93fazP1K8OeHfDvhXS4tH8M6XaWFlCMLFboFH1Pcn1J5NaElzbxcyzxp/vMBX5UC7uh0uZR/wADNIbm4b71xIfq5r0o8WRiuWNGy/xf/antR8QI04qMMNZL+9p/6SfqRd+KPDVkjvd+INNhCAk77qNcfma/LzVLn7bqd3ef8955Jf8Avpif61XLM33mJ+ppK8bNs3lmnInDl5b9b72/yPmuIOIpZ97NOnyKF+t73t5LsFe2fs3/ABl8H/B4a/eeIrHUrq51IW8cC2kaEBE3lslmHUsv5V4nRXnYXEzwdVVqe6/4Y8bAY6rl2IjiaFuaN7X13Vv1PrnV/wBunTEyuhfD26mz0e7v1ix/wFUbP515T8Wf2m/FXxW8ON4VvNC07TbF50nfyGd5G2ZwpJOMZOenYV45SqrOwRVJZjgAdSa7cRnWOxMXCpPR9LJfoeni+Js0x0JUqtX3ZaNJJafJXPrn9hnw/JHpnibxRJHhLieGxic9yil3A/77SvqauD+B/giT4ffDDRPDt1AIr0Q/abxe4nkO5gfUrkL/AMBrvK/QcqwzwmDp0nvbX1ep+v5Bgnl+W0qEt0rv1er+69grjPi98PbT4neAtS8LTqouJE86ylP/ACyuE5Q59CflPsxrs6K7KtKNaDpzV01Znp16EMTSlRqq8ZJp+jPyvbSv7M146N4mS5sPs119nvgsQaWDDYfCEgMRzxkZx1717PqH7IPj6axh1rwXrejeItNu4lntpY5TBJJGwyDtb5Rx/tmvRf2tfgY+pRS/FPwpZ7rmBP8AicW8Y5kjUYE4HqoGG9hnsc8J+zN+0IPAFyngnxhdH/hHrqTNvcNk/YZWPOf+mZPX0PPrX59HL8Pg8W8Jjk+V/DJO3/A9ez8j8fhlGDy7MZZfmqajL4Jp29L9LPZ6aPyPJPGPwz8e+ACh8X+Fr7TYpH8tJ5E3Qu+CdqyLlScAnGc4Brma/Qj9pbQrXxd8EdantjHcfY44tUtZEIYYQgllI65jLjPvX571yZxl0ctrqnB3i1dXPP4jyaOS4pUqUnKMldN/NdAorX8HaXYa34s0bRtUklS0v7+C2naIgOEdwpKkggHn0NfVGr/sL6DKxbQfH1/bDsl3ZpP/AOPKyfyrHB5ZicfBzoK9vNL8zmy7I8bmtOVTCR5uV2eqT/Gx8gUV9RS/sLa0G/c/EKyYf7Vg4P6Oantv2FL1mH2z4kQIvfytMLH9ZBXQsgzFu3s/xX+Z2LhLOW7ex/GP+Z8rUV9GfGn9mjwj8JfhxL4mi8RapqOpm6gtohII44fmJ3HYAW+6D/FXznXFjMHVwNT2VZWdr9zy8xy3EZVVVDEq0rX3vv6CojyOscaM7uQqqoyST0AFeoeG/wBmf4z+JVSWLwhNp8L4Ik1F1t8D3Rvn/wDHayPgZ4Z/4S34teGNIZcxC/S6mGMgxw/vWB+oTH4195/FP4p+G/hR4bk1zXZg87grZ2StiS6k/ur6AZ5boB+APrZRlVDF0Z4nFScYR/pn0HDuQYXMMNUxuOm404O2ll0u9Wn3Wx8TfFD4Fv8ACLQbW58V+LbKbXNQfFrpljEzjyx9+R5W24A6ABTknrwa0/2Wvha/j/x/FrOoQMdH8PMl3OSvyyz5zFFn6jcfZfeuRubnx38fviSGKteatq0oVEBIitYR2GfuxoOT+J5J5++/hj8O9G+F/hCz8K6Ou7yh5lzOR81xOQN8h+pHA7AAdq6Mqy6lj8Y61KNqMO/V9P8AN/cdmQZPQzbMXiaEOXD03pe7cmtr3+9rZKy6nWUUUV96frQUUUUAIQGBVgCCMEHvXyB+0V+y/c6dPc+Ofhrp7S2Tlpr7S4Vy0B6mSFe6dSV6jtxwPsCiuHH5fRzGl7OqvR9UeXm2UYfOaHsa69H1T8v1XU/Pz4U/tAaz4H0y48EeKYJdZ8KX0T2s1qW/fWsbgq5hJ46E/IeM9Mc15JKI1kdYnLIGIViMEjscV92/GL9lnwn8RHn13w40eha9J8zuif6PcN/00QfdJ/vLz3INfIPj74ReP/htdPD4o0CeK3U4S9iHmW0g7ESDgfQ4PtXweaYDHYWMYVvehHZ+Xby9H8j8mz3KM0wEI0sTedOF+WS1sn0fVbbPRdDlbC8l0++t7+A4ltpUmQ/7SkEfqK/VOzuor6zgvYDmO4jWVD6qwyP51+UtfZXw9/bA+HVh4Y0jQ/ElnrFrdWFlBayzrAssbsiBSww27Bxnp3rt4ax1HCSqQrSUU7Wv5X/zPS4IzTDZfOtTxM1FS5bX7q/+Z9LUV5HD+1b8CpUDN4xkiP8AdfTrnP6Rmqt/+118EbNC0Gu316QPu2+nygn/AL+BR+tfXvM8Elf2sfvR+jPPMsSu8RD/AMCX+ZzP7b2oLB8PNF04N813qwfHqqRPn9WFfFde0/tJfHHRPjFc6JD4e0++tbXSBcFjdBVMjSeXggKT0Cd/WvGYIJ7qZLa2hkmlkYKkcalmYnoAByTX5/nmJhi8bKdJ3jol93+Z+Q8U42lmGaTq0HzRskmuun+dzuvg58SLP4Va/e+LW0s6hqCWL22nwsdsayuy5dz1wFDDA5O7t1qNm+JXx+8c5P2jWNXuzxgbYbaLP/fMca5//WTz3nwv/ZL8d+M2g1PxUreHNJZgx89M3Uq99sf8OemXx64NfYvgL4ceEfhro66L4T0qO2j6yzN8007f3nfqx/QdgK9DLsnxmNpxp124Uk726v5fq/kexk3DmY5nRjSxTdPDp3ts5N9bfq9uiZzXwS+COg/B/RCkRS81u8Qfbr8r1/6Zx91jB/Enk9gPS6KK+5oUKeGpqlSVkj9TwuFo4KjGhQjaK2QUUUVqdAUUUUAFFFFABTJoIbmF7e4hSWKRSro6hlYHqCDwRT6KA3PJvFv7L3wd8WB5P+EdOkXDknztLfyMH/cwY/8Ax2vLdV/YWtWdjonxBlRP4VurEOR9SrDP5V9V0V5lfJ8DiHedNX8tPyseHiuG8qxj5qtFX8vd/Kx8ZT/sOeOFci28ZaFInYukyH8gp/nVqw/YY8SuR/afjzTIR3EFrJJ/6EVr7DorlXDmXp35H97OFcF5Onf2b/8AAn/mfN3h39iLwPYyLN4l8T6rqm058qBUto29j95vyIr2bwf8LPh94C+bwp4VsbGbbtNwE3zEehkbLfrXV0V6GHy3CYR3o00n36/e9T1sHkuX5e74ekk++7+93YUUUV2nqBRRRQAUUUUAf//Z",
       name: {
         last: "",
         first: "#Play"
       },
       isHidden: false,
       isOwn: false,
       type: "Company",
       fullName: "#Play ",
       id: "55ba0301d79a3a343900000d"
     }
   ],
 ...
 }
     */

    /**
     *@api {get} /companies/ Request Companies
     *
     * @apiVersion 0.0.1
     * @apiName getCompanies
     * @apiGroup Companies
     *
     * @apiParam (?Field=value) {String} viewType="thumbnails" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=50 Count of Companies which will show
     * @apiParam (?Field=value) {String} contentType="Companies" Type of content
     *
     * @apiSuccess {Object} Companies
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
  total: 220,
  data: [
    {
      _id: "583e86c5ed5a2cbf0db9f53b",
      salesPurchases: {
        receiveMessages: 0,
        language: "English",
        reference: "",
        active: true,
        implementedBy: null,
        salesTeam: null,
        salesPerson: "56e17661177f76f72edf774c",
        isSupplier: false,
        isCustomer: true
      },
      address: {
        country: "Canada"
      },
      company: null,
      name: {
        last: "",
        first: "Deskree"
      },
      fullName: "Deskree ",
      id: "583e86c5ed5a2cbf0db9f53b"
    },
    {
      _id: "583d503ed3ce17370e90bded",
      salesPurchases: {
        receiveMessages: 0,
        language: "English",
        reference: "",
        active: false,
        implementedBy: null,
        salesTeam: null,
        salesPerson: null,
        isSupplier: false,
        isCustomer: false
      },
      address: {
        country: "Select"
      },
      company: null,
      name: {
        last: "",
        first: "Master Your Medics"
      },
      fullName: "Master Your Medics ",
      id: "583d503ed3ce17370e90bded"
    },
    ...
  ]
}
     */
    router.get('/', handler.getByViewType);

    /**
     *@api {get} /customers/getCustomersImages/ Request CustomersImages
     *
     * @apiVersion 0.0.1
     * @apiName getCustomersImages
     * @apiGroup Customers
     *
     * @apiParam (?Field=value) {Array} ids of Unique Id of Customer
     *
     * @apiSuccess {Object} CustomersImages
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
   data: [
     {
       _id: "57ed1cd0ae7900f82086d7a1",
       imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       fullName: "undefined undefined",
       id: "57ed1cd0ae7900f82086d7a1"
     },
     {
       _id: "57f214b59c097cc420eb7ef2",
       imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       fullName: "undefined undefined",
       id: "57f214b59c097cc420eb7ef2"
     },
     ...
   ]
 }
     */
    router.get('/getCustomersImages', handler.getCustomersImages);

    /**
     *@api {get} /customers/getCompaniesForDd Request Customers for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getCustomersForDropDown
     * @apiGroup Customers
     *
     * @apiSuccess {Object} Customers for dropDown
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "data": [
             {
                 "_id": "55ba0301d79a3a343900000d",
                 "name": {
                     "first": "#Play"
                 },
                 "fullName": "#Play undefined",
                 "id": "55ba0301d79a3a343900000d"
             },
             {
                 "_id": "5721d153dce306912118af85",
                 "name": {
                     "first": "AVANT WEB SOLUTIONS"
                 },
                 "fullName": "AVANT WEB SOLUTIONS undefined",
                 "id": "5721d153dce306912118af85"
             },
             ...
         ]
     }
     */

    router.get('/getCompaniesForDd', handler.getCompaniesForDd);

    /**
     *@api {get} /customers/getCompaniesAlphabet/ Request CompaniesAlphabet
     *
     * @apiVersion 0.0.1
     * @apiName getCompaniesAlphabet
     * @apiGroup Customers
     *
     * @apiParam (?Field=value) {Number} mid Number of module
     * @apiParam (?Field=value) {String="ownCompanies", "Companies", "Persons"} contentType Type of content
     *
     * @apiSuccess {Object} CompaniesAlphabet
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
  data: [
    {
      _id: "s"
    },
    {
      _id: "2"
    },
    {
      _id: "i"
    },
    {
      _id: "1"
    },
    {
      _id: "e"
    },
    {
      _id: "Z"
    },
    {
      _id: "m"
    },
    {
      _id: "E"
    },
    {
      _id: "H"
    },
    {
      _id: "U"
    },
    {
      _id: "Q"
    },
    {
      _id: "J"
    },
    {
      _id: "K"
    },
    {
      _id: "N"
    },
    {
      _id: "P"
    },
    {
      _id: "C"
    },
    {
      _id: "B"
    },
    {
      _id: "O"
    },
    {
      _id: "L"
    },
    {
      _id: "S"
    },
    {
      _id: "A"
    },
    {
      _id: "#"
    },
    {
      _id: "n"
    },
    {
      _id: "G"
    },
    {
      _id: "M"
    },
    {
      _id: "R"
    },
    {
      _id: "Y"
    },
    {
      _id: "T"
    },
    {
      _id: "F"
    },
    {
      _id: "D"
    },
    {
      _id: "I"
    },
    {
      _id: "W"
    },
    {
      _id: "V"
    }
  ]
}
     */
    router.get('/getCompaniesAlphabet', handler.getCompaniesAlphabet);

    /**
     *@api {get} /customers/exportToXlsx/ Download Customers.xlsx
     *
     * @apiVersion 0.0.1
     * @apiName exportToXlsx
     * @apiGroup Customers
     *
     * @apiParam (?Field=type) {String="Companies", "Persons"} contentType Type of content
     *
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     */
    router.get('/exportToXlsx', handler.exportToXlsx);

    /**
     *@api {get} /customers/exportToCsv/ Download Customers.csv
     *
     * @apiVersion 0.0.1
     * @apiName exportToCsv
     * @apiGroup Customers
     *
     * @apiParam (?Field=type) {String="Companies", "Persons"} contentType Type of content
     *
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     */
    router.get('/exportToCsv', handler.exportToCsv);

    /**
     *@api {get} /companies/:id Request the company
     *
     * @apiVersion 0.0.1
     * @apiName getCompany
     * @apiGroup Companies
     *
     * @apiSuccess {Object} SomeCompany
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       _id: "5832f543a7cfd69d0d1e3315",
       externalId: null,
       __v: 0,
       channel: null,
       integrationId: "",
       companyInfo: {
         industry: null
       },
       editedBy: {
         date: "2016-11-21T13:26:10.638Z",
         user: {
           _id: "579f4680a836b2661d941593",
           login: "iryna.labai"
         }
       },
       createdBy: {
         date: "2016-11-21T13:23:15.726Z",
         user: {
           _id: "579f4680a836b2661d941593",
           login: "iryna.labai"
         }
       },
       history: [

       ],
       attachments: [

       ],
       notes: [
         {
           date: "2016-11-21T13:23:15.734Z",
           history: {
             prevValue: null,
             newValue: "https://www.linkedin.com/redirec",
             changedField: "Website",
             collectionName: "Companies",
             contentId: "5832f543a7cfd69d0d1e3315",
             date: "2016-11-21T13:23:15.734Z"
           }
         },
         {
           date: "2016-11-21T13:23:15.734Z",
           history: {
             prevValue: null,
             newValue: "Israel",
             changedField: "Country",
             collectionName: "Companies",
             contentId: "5832f543a7cfd69d0d1e3315",
             date: "2016-11-21T13:23:15.734Z"
           }
         },
         {
           date: "2016-11-21T13:23:15.734Z",
           history: {
             prevValue: null,
             newValue: "moblers",
             changedField: "Name",
             collectionName: "Companies",
             contentId: "5832f543a7cfd69d0d1e3315",
             date: "2016-11-21T13:23:15.734Z"
           }
         },
         {
           date: "2016-11-21T13:23:15.734Z",
           history: {
             prevValue: null,
             newValue: "2016-11-21T13:23:15.726Z",
             changedField: "Creation Date",
             collectionName: "Companies",
             contentId: "5832f543a7cfd69d0d1e3315",
             date: "2016-11-21T13:23:15.734Z"
           }
         },
         {
           date: "2016-11-21T13:23:15.734Z",
           history: {
             prevValue: null,
             newValue: "https://www.linkedin.com/company/2248624?trk=tyah&trkInfo=clickedVertical%3Acompany%2CclickedEntityId%3A2248624%2Cidx%3A1-1-1%2CtarId%3A1479734429301%2Ctas%3Amoblers",
             changedField: "LinkedIn",
             collectionName: "Companies",
             contentId: "5832f543a7cfd69d0d1e3315",
             date: "2016-11-21T13:23:15.734Z"
           }
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "Guy",
             changedField: "First Name",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "Doron",
             changedField: "Last Name",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "https://www.linkedin.com/in/guydoron?trk=extra_biz_connect_hb_upphoto",
             changedField: "LinkedIn",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "doronguy1",
             changedField: "Skype",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "Israel",
             changedField: "Country",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "Owner",
             changedField: "Job Position",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-21T13:29:23.861Z",
           history: {
             prevValue: null,
             newValue: "2016-11-21T13:29:23.846Z",
             changedField: "Creation Date",
             collectionName: "Persons",
             contentId: "5832f6b3aefcfc140ea7bcce",
             date: "2016-11-21T13:29:23.861Z"
           },
           name: "contact Guy Doron"
         },
         {
           date: "2016-11-29T10:23:50.991Z",
           history: {
             editedBy: {
               _id: "579f4680a836b2661d941593",
               login: "iryna.labai"
             },
             prevValue: null,
             newValue: "Eugen Bernikevich",
             changedField: "Assigned To",
             collectionName: "Opportunities",
             contentId: "583d5736aefcfc140ea84b97",
             date: "2016-11-29T10:23:50.991Z"
           },
           user: {
             _id: "579f4680a836b2661d941593",
             login: "iryna.labai"
           },
           name: "opportunity ECIsland Sales Tool Unity"
         },
         {
           date: "2016-11-29T10:23:50.991Z",
           history: {
             editedBy: {
               _id: "579f4680a836b2661d941593",
               login: "iryna.labai"
             },
             prevValue: null,
             newValue: true,
             changedField: "isOpportunitie",
             collectionName: "Opportunities",
             contentId: "583d5736aefcfc140ea84b97",
             date: "2016-11-29T10:23:50.991Z"
           },
           user: {
             _id: "579f4680a836b2661d941593",
             login: "iryna.labai"
           },
           name: "opportunity ECIsland Sales Tool Unity"
         },
         {
           date: "2016-11-29T10:23:50.991Z",
           history: {
             editedBy: {
               _id: "579f4680a836b2661d941593",
               login: "iryna.labai"
             },
             prevValue: null,
             newValue: "2016-11-29T10:23:50.971Z",
             changedField: "Creation Date",
             collectionName: "Opportunities",
             contentId: "583d5736aefcfc140ea84b97",
             date: "2016-11-29T10:23:50.991Z"
           },
           user: {
             _id: "579f4680a836b2661d941593",
             login: "iryna.labai"
           },
           name: "opportunity ECIsland Sales Tool Unity"
         }
       ],
       groups: {
         group: [

         ],
         users: [

         ],
         owner: null
       },
       whoCanRW: "everyOne",
       social: {
         LI: "https://www.linkedin.com/company/2248624?trk=tyah&trkInfo=clickedVertical%3Acompany%2CclickedEntityId%3A2248624%2Cidx%3A1-1-1%2CtarId%3A1479734429301%2Ctas%3Amoblers",
         FB: ""
       },
       color: "#4d5a75",
       relatedUser: null,
       salesPurchases: {
         receiveMessages: 0,
         language: "English",
         reference: "",
         active: false,
         implementedBy: null,
         salesTeam: null,
         salesPerson: null,
         isSupplier: false,
         isCustomer: false
       },
       title: "",
       internalNotes: "",
       contacts: [
         {
           _id: "5832f6b3aefcfc140ea7bcce",
           dateBirth: "",
           externalId: null,
           __v: 0,
           channel: null,
           integrationId: "",
           companyInfo: {
             industry: null
           },
           editedBy: {
             date: "2016-11-21T13:29:23.846Z",
             user: "579f4680a836b2661d941593"
           },
           createdBy: {
             date: "2016-11-21T13:29:23.846Z",
             user: "579f4680a836b2661d941593"
           },
           history: [

           ],
           attachments: [

           ],
           notes: [

           ],
           groups: {
             group: [

             ],
             users: [

             ],
             owner: null
           },
           whoCanRW: "everyOne",
           social: {
             LI: "https://www.linkedin.com/in/guydoron?trk=extra_biz_connect_hb_upphoto",
             FB: ""
           },
           color: "#4d5a75",
           relatedUser: null,
           salesPurchases: {
             receiveMessages: 0,
             language: "English",
             reference: "",
             active: false,
             implementedBy: null,
             salesTeam: null,
             salesPerson: null,
             isSupplier: false,
             isCustomer: true
           },
           title: "",
           internalNotes: "",
           contacts: [

           ],
           phones: {
             fax: "",
             mobile: "",
             phone: ""
           },
           skype: "doronguy1",
           jobPosition: "Owner",
           website: "",
           shippingAddress: {
             name: "",
             country: "",
             zip: "",
             state: "",
             city: "",
             street: ""
           },
           address: {
             country: "Israel",
             zip: "43880",
             state: "",
             city: "Kibutz Haogen",
             street: ""
           },
           timezone: "UTC",
           department: null,
           company: "5832f543a7cfd69d0d1e3315",
           email: "",
           imageSrc: "data:image/jpeg;base64,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",
           name: {
             last: "Doron",
             first: "Guy"
           },
           isHidden: false,
           isOwn: false,
           type: "Person",
           fullName: "Guy Doron",
           id: "5832f6b3aefcfc140ea7bcce"
         }
       ],
       phones: {
         fax: "",
         mobile: "",
         phone: ""
       },
       skype: "",
       jobPosition: "",
       website: "https://www.linkedin.com/redirec",
       shippingAddress: {
         name: "",
         country: "",
         zip: "",
         state: "",
         city: "",
         street: ""
       },
       address: {
         country: "Israel",
         zip: "43880",
         state: "",
         city: "Kibutz Haogen",
         street: ""
       },
       timezone: "UTC",
       department: null,
       company: null,
       email: "",
       imageSrc: "data:image/jpeg;base64,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",
       name: {
         last: "",
         first: "moblers"
       },
       isHidden: false,
       isOwn: false,
       type: "Company",
       fullName: "moblers ",
       id: "5832f543a7cfd69d0d1e3315",
       opportunities: [
         {
           _id: "583d5736aefcfc140ea84b97",
           __v: 0,
           externalId: null,
           skype: "",
           social: {
             LI: "",
             FB: ""
           },
           projectType: "fixed",
           attachments: [

           ],
           notes: [

           ],
           convertedDate: "2016-11-29T10:23:50.971Z",
           isConverted: false,
           source: "",
           campaign: "",
           editedBy: {
             date: "2016-11-29T10:28:54.841Z",
             user: "579f4680a836b2661d941593"
           },
           createdBy: {
             date: "2016-11-29T10:23:50.971Z",
             user: "579f4680a836b2661d941593"
           },
           sequence: 38,
           groups: {
             group: [

             ],
             users: [

             ],
             owner: null
           },
           whoCanRW: "everyOne",
           workflow: {
             _id: "528cdd2af3f67bc40b000007",
             name: "To estimate"
           },
           reffered: "",
           optout: false,
           active: true,
           color: "#4d5a75",
           categories: {
             name: "",
             id: ""
           },
           priority: "Cold",
           expectedClosing: null,
           nextAction: {
             date: "2016-11-29T10:23:50.971Z",
             desc: ""
           },
           internalNotes: "",
           salesTeam: null,
           salesPerson: {
             _id: "55b92ad221e4b7c40f000072",
             name: {
               last: "Bernikevich",
               first: "Eugen"
             },
             fullName: "Eugen Bernikevich",
             id: "55b92ad221e4b7c40f000072"
           },
           func: "",
           phones: {
             fax: "",
             phone: "",
             mobile: ""
           },
           email: "",
           contactName: {
             last: "",
             first: ""
           },
           address: {
             country: "",
             zip: "",
             state: "",
             city: "",
             street: ""
           },
           tags: [
             "578893982bfddc9a494cce04"
           ],
           customer: "5832f6b3aefcfc140ea7bcce",
           company: "5832f543a7cfd69d0d1e3315",
           tempCompanyField: "",
           creationDate: "2016-11-29T10:23:50.970Z",
           jobPosition: "",
           expectedRevenue: {
             currency: "$",
             progress: 0,
             value: 0
           },
           name: "ECIsland Sales Tool Unity",
           isOpportunitie: true
         }
       ]
     }
     */
    router.get('/:id', handler.getById);

    /**
     *@api {post} /companies/uploadFiles Request for updating Company and uploading new files
     *
     * @apiVersion 0.0.1
     * @apiName UpdateCompanyAndUploadFiles
     * @apiGroup Companies
     *
     * @apiHeader (HeaderName=HeaderValue) {String} Content-Type="multipart/form-data"
     * @apiHeader (HeaderName=HeaderValue) {String} modelid
     * @apiHeader (HeaderName=HeaderValue) {String="Companies","Persons"} modelname
     *
     * @apiSuccess {Object} Company Updated company
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
       "success": "Customers updated success",
       "data": {
         "_id": "55b92ad521e4b7c40f00061d",
         "ID": 2,
         "__v": 0,
         "companyInfo": {
           "size": "574c54ec83569c287bf59584",
           "industry": "574c54e22b7598157b94f14c"
         },
         "editedBy": {
           "date": "2016-06-30T13:30:03.008Z",
           "user": "52203e707d4dba8813000003"
         },
         "createdBy": {
           "date": "2015-07-29T19:34:45.997Z",
           "user": "52203e707d4dba8813000003"
         },
         "history": [

         ],
         "attachments": [
           {
             "_id": "57751edbc7df8a971fd45d84",
             "name": "checkEmployeesOnWtracks.js",
             "shortPas": "uploads%2Fcompanies%2F55b92ad521e4b7c40f00061d%2FcheckEmployeesOnWtracks.js",
             "size": "0.006&nbsp;Mb",
             "uploadDate": "2016-06-30T13:30:03.316Z",
             "uploaderName": "admin",
             "noteId": "1467293402830"
           },
           {
             "_id": "577fcee05651db3a56865d9d",
             "name": "soedinennye-shtaty-nyu-york-65.jpg",
             "shortPas": "uploads%2Fcompanies%2F55b92ad521e4b7c40f00061d%2Fsoedinennye-shtaty-nyu-york-65.jpg",
             "size": "0.544&nbsp;Mb",
             "uploadDate": "2016-07-08T16:03:44.912Z",
             "uploaderName": "admin"
           }
         ],
         "notes": [
           {
             "date": "2016-06-30T13:30:03.008Z",
             "note": "sadasdsad",
             "title": "",
             "_id": "1467293402830"
           }
         ],
         "groups": {
           "group": [

           ],
           "users": [

           ],
           "owner": "52203e707d4dba8813000003"
         },
         "whoCanRW": "everyOne",
         "social": {
           "LI": "",
           "FB": ""
         },
         "color": "#4d5a75",
         "relatedUser": null,
         "salesPurchases": {
           "receiveMessages": 0,
           "language": "",
           "reference": "",
           "active": false,
           "implementedBy": null,
           "salesTeam": null,
           "salesPerson": null,
           "isSupplier": false,
           "isCustomer": true
         },
         "title": "",
         "internalNotes": "",
         "contacts": [

         ],
         "phones": {
           "fax": "",
           "mobile": "",
           "phone": "+61 3 9039 9999"
         },
         "skype": "",
         "jobPosition": "",
         "website": "http://www.buzinga.com.au/",
         "address": {
           "country": "Australia",
           "zip": "3121",
           "state": "Melbourne",
           "city": "Richmond",
           "street": "Level 1, 225 - 227 Swan St"
         },
         "timezone": "UTC",
         "department": null,
         "company": null,
         "email": "jason@buzinga.com.au",
         "imageSrc": "data:image/jpeg;base64,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",
         "name": {
           "last": "",
           "first": "Buzinga"
         },
         "isOwn": false,
         "type": "Company",
         "fullName": "Buzinga ",
         "id": "55b92ad521e4b7c40f00061d"
       }
     }
     */

    router.post('/uploadFiles', accessStackMiddleware, multipartMiddleware, handler.uploadFile);

    /**
     *@api {post} /companies/ Request for creating new company
     *
     * @apiVersion 0.0.1
     * @apiName CreateNewCompany
     * @apiGroup Companies
     *
     * @apiParamExample {json} Request-Example:
     {
       "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
       "isOwn": false,
       "type": "Company",
       "email": "",
       "name": {
         "first": "NewCompany",
         "last": ""
       },
       "address": {
         "street": "",
         "city": "",
         "state": "",
         "zip": "",
         "country": ""
       },
       "website": "",
       "contacts": [

       ],
       "phones": {
         "phone": "",
         "mobile": "",
         "fax": ""
       },
       "internalNotes": "",
       "salesPurchases": {
         "isCustomer": false,
         "isSupplier": false,
         "active": false,
         "salesPerson": null,
         "salesTeam": null,
         "implementedBy": null,
         "reference": "",
         "language": "English"
       },
       "social": {
         "LI": "",
         "FB": ""
       },
       "history": [

       ],
       "attachments": [

       ],
       "notes": [

       ],
       "groups": {
         "owner": null,
         "users": [

         ],
         "group": [

         ]
       },
       "whoCanRW": "everyOne"
     }
     * @apiSuccess {Object} NewCompany Just created new company
     * @apiSuccessExample Success-Response:
     HTTP/1.1 201 Created
     {
         "success":"A new Person crate success",
         "id":"577fc8695651db3a56865d9c"
     }
     */
    router.post('/', accessStackMiddleware, handler.create);
    router.put('/:id', accessStackMiddleware, handler.update);

    /**
     *@api {patch} /companies/:id Request for updating only selected fields on chosen Company
     *
     * @apiVersion 0.0.1
     * @apiName UpdateCompany
     * @apiGroup Companies
     *
     * @apiParam {String} id Unique id of Company
     * @apiParamExample {json} Request-Example:
     {
           "address": {
             "country": "Australia",
             "zip": "31212",
             "state": "Melbourne",
             "city": "Richmond",
             "street": "Level 1, 225 - 227 Swan St"
           }
     }
     * @apiSuccess {Object} PartlyUpdatedCompany Just updated chosen fields in Company
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
           "success": "Customer updated",
           "notes": [
             {
               "_id": "1467293402830",
               "title": "",
               "note": "sadasdsad",
               "date": "2016-06-30T13:30:03.008Z"
             }
           ]
     }
     */
    router.patch('/:id', accessStackMiddleware, handler.udateOnlySelectedFields);

    /**
     *@api {delete} /companies/:id Request for deleting the Company
     *
     * @apiVersion 0.0.1
     * @apiName deleteCompany
     * @apiGroup Companies
     *
     * @apiParam {String} id Unique id of Company
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "success": "customer removed"
     }
     */
    router.delete('/:id', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.remove);

    /**
     *@api {delete} /companies/ Request for deleting a few Companies
     *
     * @apiVersion 0.0.1
     * @apiName deleteFewCompanies
     * @apiGroup Companies
     *
     * @apiParamExample {json} Request-Example:
     {
         "contentType": "Companies",
         "ids": [
             "577fc8695651db3a56865d9c",
             "577fc84b5651db3a56865d9b"
         ]
     }
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "ok":1,
         "n":2
     }
     */
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, handler.bulkRemove);

    return router;
};
