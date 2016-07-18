var express = require('express');
var router = express.Router();
var PaymentHandler = require('../handlers/payment');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new PaymentHandler(models, event);
    var moduleId = MODULES.CUSTOMER_PAYMENTS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /payment/ Request Payments
     *
     * @apiVersion 0.0.1
     * @apiName getPayments
     * @apiGroup Payment
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of Payments which will show
     * @apiParam (?Field=value) {String="PayrollPayments","DividendPayments"} contentType Type of content
     *
     * @apiSuccess {Object} Payments
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
  "data": [
    {
      "_id": "55ba0301d79a3a343900000d",
      "__v": 0,
      "companyInfo": {
        "size": "574c54ec83569c287bf59583",
        "industry": "574c54e22b7598157b94f1a5"
      },
      "editedBy": {
        "date": "2016-05-31T18:54:27.587Z",
        "user": "57231ce22387d7b821a694c2"
      },
      "createdBy": {
        "date": "2015-07-30T10:57:05.119Z",
        "user": "55ba00e9d79a3a343900000c"
      },
      "history": [

      ],
      "attachments": [

      ],
      "notes": [

      ],
      "groups": {
        "group": [

        ],
        "users": [

        ],
        "owner": "55b9fbcdd79a3a3439000007"
      },
      "whoCanRW": "everyOne",
      "social": {
        "LI": "https://www.linkedin.com/company/hashplay-inc",
        "FB": ""
      },
      "color": "#4d5a75",
      "relatedUser": null,
      "salesPurchases": {
        "receiveMessages": 0,
        "language": "English",
        "reference": "",
        "active": false,
        "implementedBy": null,
        "salesTeam": null,
        "salesPerson": null,
        "isSupplier": false,
        "isCustomer": false
      },
      "title": "",
      "internalNotes": "",
      "contacts": [

      ],
      "phones": {
        "fax": "",
        "mobile": "",
        "phone": ""
      },
      "skype": "",
      "jobPosition": "",
      "website": "hashplay.net",
      "address": {
        "country": "United States",
        "zip": "94107",
        "state": "California",
        "city": "San Francisco",
        "street": "350 Townsend St. 755"
      },
      "timezone": "UTC",
      "department": null,
      "company": null,
      "email": "contact@hashplay.tv",
      "imageSrc": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAoqnqur6XoVhLqms6jb2NnAN0k9xIERR7k8V85fEb9tLQNLM2m/DrSDqtwpKC/u8x24PqqffcfXb+NceLx+HwMeavK3l1+487MM2weVw5sVNLsur9FufTNZmq+J/DWhR+brfiHTNPT+9dXccQ/NiK/PLxh8e/ix43Zl1fxhew254+zWLfZosehCYLf8CJpfD3wL+MXjaCLVNK8HahcW9yokjubmRIUkUjIYNKw3A+ozXgS4mdaXJhKLl/XZXPkZ8cSxE3Ty/DSm/66JP8z7pm+NvwhgcpJ8SfD2R/dv42/katWHxa+F2puIrH4h+HZXY4CDUoQxPsC2a+OYP2O/jPMgaSz0iAn+GS/BI/75BFVNS/ZK+N1gheHw7aXwAyfs1/Dn8nZSaP7YzRavDO3ow/1jz6PvSwLt6S/r8D74gura6QSWtxFMhGQ0bhgR9RUtfmVqmlfEv4V6jDFqMWueG7t8tCVleAuB1KMpww5HQ969H8E/te/FHwy8MGvy2/iOyTAZLpRHOV9pVHX3YNV0eJ6PNyYmm4P7/v2f4GmG46w/tPZY2lKm/vt6qyf4M+7qK8t+GX7Rnw5+JhSxtL86XqrYH2C+IR3P8A0zb7r/QHPtXqVfRUMRSxMPaUZJryPssLjKGNpqrh5qUe6CiiitjpCiiigAooooAK4D4ufGbwr8ItH+2axL9p1G4U/Y9OiYebOemT/dQHqx/DJ4p3xk+LOjfCPwpJrV7snv58xafZ7sGeXHfHIQdWP0HUivhfT9O+IX7QPxCcK76hquoOZJppDiG1hHc9kRRwAPYDJNeDm+bvCNYfDrmqy/D/AIPZHyfEXEMsvaweDXNXlst7X2079l83pvN42+IvxH+O3iaG1uRcXjzTEWGk2asYoif7qdzjOWPPXkCuAkjaKRonA3ISpwc8j3r7sf4ceF/2dvg14k1bRcS60umyLNqki4lkmcbEC/3FDMMKPxyea+Ea+OzXB1cLKLxEuapLV+Xb9fLsfm2f5dXwE4Sxk+atNOUutlslfq9/Logr9S/Cumf2L4Y0jR8Y+w2FvbY/3I1X+lfmf4G01dY8aaDpTruW71K2hYeqtIoP6V+nN5rOkadn+0NVs7bHJ86dU/ma9zhOCSq1H5L8z6rw+pqKr15f3V+bf6Fyiufl+IPgOBts3jXQkPo2owj/ANmqa38a+DrsgWvivR5iegS+ibP5NX1/tqbduZfefoqxFFuymvvR88/tz6QJdA8La6Bza3dxaE+0qKw/9FH86+P6+5f2x7eHU/g9HqFtJHMlnqlvJvRgwwwdOo92FfDVfnnEkFHHuS6pP8LfofjnGtJQzaUl9pRf4W/Qu6fpGrajBd3umWU86adGLi5eJSTDHuA3nHIUEgZ6DIr6D+B/7WOr+HJbfwz8SbibUtKZgkWosS9xajoN/eRB/wB9DnrwK4z9lXXo9F+Mml2twy/Z9Yhn06UN91t6blU+uWRR+NeqftD/ALLcKw3fjr4Z2WwpumvtJjHGOpkgHbuSn/fPpRl1DFUqH17BS1i7Sj3W/wA/z7DyXCY+hhHmmWTvKLanHulZ7dVZ7b9UfU+n6jY6tYwanpl3FdWl1GJYZomDJIhGQQR1FWK+EP2cvj/efDTVo/DHiW5kl8M3smG3ZY2Mh/5aL/sZ+8v4jnr92QzRXEKXEEqyRSqHR1OVZSMgg9wRX2uWZlTzKlzx0kt12/4B+m5HndHO8P7WGkl8S7P/ACfQfRRRXpHthVbUdQs9J0+51TUZ1gtbSJ55pG6IijLE/QCrNfOf7ZvxDfQfCFn4F065KXWvOZLoKeRaxkcH03Pge4VhXJjsVHBYeVeXRfj0/E8/NMfDLMHUxU/srTzeyX3nzZ8V/iJrXxq+ILahEsv2eSUWmlWbsB5URbCg84DMTljnv1wBX0r8MPE/wI/Z+8JLpl3440281u6US6nPZA3LySgcRqYwcIuSBk+p718U0V+c4XNamGrSxPKpVJdX09F/Wh+L4DP62BxM8a4KdWX2pX0vvZK357aH0h+0B+094f8AiV4Ql8F+EdK1KCKe7jkuLm7VEEkSEsFVVYnlwhyccDpzXzfRRXLjMbVx1X2tZ67HDmWZ4jNa/wBYxLvK1u2g+Gaa3lSe3leKSMhkdGKspHQgjoaJZ552LzTPIzHJLMSSfxplFct+hwXdrBQCRyKKKAJhe3iwPbLdzCGXG+MSHa2DkZHQ4NQ0UUXuDbe5oeHdYm8PeINM1+3BMum3kN2gBxlo3DD+VfbXhn9sf4Ta2RDrI1PQpeObq38yIn2aIsfzUV8K0V6WX5riMtuqNrPdM9rKM/xmS8yw9mpbpq+33M9y/aN8I+ALu9PxH+F3iDS76xv5M6lZ2twpe3mY8SiP7wRj144b/e49R/Y8+ME2sWL/AAv1+5aS60+IzaXLI+S8A+9Dz/c6j/ZyOi18eVreEvE2o+DvE2m+KNKkK3Wm3CTpg43AHlT7MMg+xNbYbNfYY1YqEeVP4ktvP/P1OnBZ+8Lmix9OHIpfFFbNPe3bvbufqVRWb4b1/T/FWgaf4k0mQvaalbpcwk9QrDOD7jofcVpV+mRkpJSjsz9whOM4qUXdMK/PD9pbxcPF/wAYdcmifdbaZINMg57Q/K/5ybzX6E3k4tbSe5Y4EUbOT9Bmvzd+GdgfGfxi0K2uVEq6jrSTzBhncvmeY+fXgGvl+J5ynGlho/bf+S/U+E45qTqQw+Bh/wAvJflZL/0o5LT9I1bVpPK0rTLu8f8Au28LSH8lBrpbH4O/FTUtv2P4e68+7oTYyKPzYCv0thhht4xFBEkaDoqKAB+ApXdY0aRzhVBJPsKxhwlTXx1W/RW/VnPS8PaKX72u36JL82z8qtU0y+0XUrrSNUtmt7yymeCeJiMxyKcMpxxkEEVWrQ8RalJrHiDU9Xm/1l9eTXLfV3LH+dZ9fFTSUmo7H5jUUVNqG19D0n4H/BqX4za5f6QuvLpKafbC4eU23nFssFAC7l/nXu1r+wtoKKPt3xCv5T38qxSMfqzVh/sLW4bWfFl1t5S1tYwf953P/std7+2J4r8S+FPCGgXHhrWrzTJZdVPmS2spjZgsTEKSOozzjpwK+uwGBwUMs+u4inzNX6vvbvY/Q8pyvLKWR/2njKPO1e+r/mt3sZqfsOeBAPn8Ya8T7CEf+yVHN+w34MYfuPGutIf9uKJv5AVgfCP9siWLyND+K0JkQAImr20fzZ7GaMdf95R/wE9a+ptE17RvEmmw6xoGqW1/ZXC7o57eQOrD6jv7dRXp4LCZPmEL0YK/bW6/E9zLMBw5m9Pmw1NX6ptqS9Vf8Vp5nzDf/sK2+13034jyggZVJtMByfdhKP5V8nTRtDK8LdUYqfqDX6vV+W3jC1Nj4t1uxPW31G5i/wC+ZWH9K8XiLLsPgVTlh42ve+r8rbnzPGeS4PK40Z4SHLzc19W+1t2/MyK6Dwz8P/GnjK2urvwr4bvdVismRLg2qbzGWztyo55we3aufr6e/YYv2j8ReKdM3fLPZW8+M9SjsP8A2c14mW4aGMxUaE3ZO+3ofMZLgaeZY6nharaUr6rfZtHgWofDzx7pKl9S8F63bKvVpLCUKPx24rn2RkYo6lWU4IIwQa/V+vGf2sfDVrq/wb1bUVtI2u9Mlt7tJAg3gCVUbnrja5P4V9BjOGFQoyrU6l+VN2a7ed/0Pr8y4FjhMNUxFGs3ypuzjvZX3v8AoY/7Gfi+TXfhpceHLmTdN4fvGij9fIkG9PybzB9AK9+r40/Yc1kweM/EOgFvlvNNW6A/2opQv8pT+VfZdfQZDXdfAU291p9234H1/CeKeKymk5PWN4/c7L8LGD49leDwL4jnjJDx6TeOpHqIWIr4R/ZcjSX46+GFccBrph9RaykV99+IrEan4f1PTW6XdnNAf+BIR/Wvz3/Z4vxo/wAbfCs0x2ZvmtTn1ljePH5vXmZ97uOwsntf9UeHxX7ma4CpLbmX4SifozVLWnaPR7+RfvLbSsPqENXahvYPtNnPbYz5sTJ+YIr6qSumfezTcWkflNIcuxPcmkqS6jaG6mhdSrJIykHsQajr8bZ/Nj0Z9YfsJKMeNX7g6eP/AEoroP24lB+H+gt3Gsgf+QJP8K5n9hOfF14xtv78dk/5GYf+zV0X7ccmPA/h6L+9qzN+ULf419tSa/1efo//AEo/UMO1/qc/R/8ApbPjOum8DfEjxn8OdSGp+Etcns2J/eQ53QzD0eM/K31xkdiKb4H+HfjD4jap/ZPhHRpr2RcGWQfLFCp7u54Ufqe2a+ufhZ+yD4R8KeXqvjuSLxFqQAItypFnE3sp5k+rcf7NfPZbluMxc1PD+6l9ra39eR8dkmSZjmNRVcJeKX29kvR7v5fM7r4EfFHV/it4O/t3WvDkul3EMnkmQA+RdcZ8yLPOOxHOD3Pb4K+JAA+InigDtrV7/wCj3r9O4YYbeJILeJIoo1CIiKAqqOAAB0FfmB8QJUn8eeJJ42ysmr3jqfUGZzXu8SwnTw1GFSXNJXu9rn1XG9OpRwWGp1p88k3d2tfRdDBr6L/YhJ/4WJrS9jpDH/yNHXzpX0l+w7bF/HPiC67RaWqfi0q//E14OSK+YUvX9GfKcLq+b0Ld/wBGfZ1cN8cYUn+D/jBJBkDSLhvxVCR+oFdzXmv7R+qppHwT8VXDNgzWi2q+5lkWP+TGv0jGtRw1Rv8Alf5H7TmclDBVpS2UJfkz5c/Y1kZPjIFXpJpVyp+mUP8AQV9218P/ALFOnvc/FW/vgPks9GmJOP4mliUD8t35V9wV4/DCawOvd/ofOcDRayq76yl+ghAYEEcHg1+anjax1D4afFzVIYE23Giay1xbbxwyiTzIifYqVP41+llfGn7a/gabTvFWmePbaPNtq0As7ggfdniHyk/7yEY/3DUcT4eVTDRrx3g/wf8AwbGfHOElVwMcVT3pyv8AJ6fnYs6b+3R4hiI/tfwBp1yO/wBmvHh/9CV67DTf24fA06r/AGp4Q1q0c/e8l4plH4kqT+VfGNFfMU+Icwp/bv6pf5HwtHjDOKW9W/ql/lc1vF9/puqeK9Z1PRlkWwvL+4uLZZFCusTyMyggEgEAismiivGlJzk5PqfNzm6knN9T6P8A2Kdd03SPFfiK31PUra0S5sIinnyrGHZZOgyeThq+mfiB4H+H3xc0uz0nxJeR3VtZ3Qu4/st4qsWClSpKn7pDHOPQc1+a9OWWVfuyMPoa97BZ4sLhfqtSkpx1693fsz63K+Ko4DArAVqCqQ13e93fazP1K8OeHfDvhXS4tH8M6XaWFlCMLFboFH1Pcn1J5NaElzbxcyzxp/vMBX5UC7uh0uZR/wADNIbm4b71xIfq5r0o8WRiuWNGy/xf/antR8QI04qMMNZL+9p/6SfqRd+KPDVkjvd+INNhCAk77qNcfma/LzVLn7bqd3ef8955Jf8Avpif61XLM33mJ+ppK8bNs3lmnInDl5b9b72/yPmuIOIpZ97NOnyKF+t73t5LsFe2fs3/ABl8H/B4a/eeIrHUrq51IW8cC2kaEBE3lslmHUsv5V4nRXnYXEzwdVVqe6/4Y8bAY6rl2IjiaFuaN7X13Vv1PrnV/wBunTEyuhfD26mz0e7v1ix/wFUbP515T8Wf2m/FXxW8ON4VvNC07TbF50nfyGd5G2ZwpJOMZOenYV45SqrOwRVJZjgAdSa7cRnWOxMXCpPR9LJfoeni+Js0x0JUqtX3ZaNJJafJXPrn9hnw/JHpnibxRJHhLieGxic9yil3A/77SvqauD+B/giT4ffDDRPDt1AIr0Q/abxe4nkO5gfUrkL/AMBrvK/QcqwzwmDp0nvbX1ep+v5Bgnl+W0qEt0rv1er+69grjPi98PbT4neAtS8LTqouJE86ylP/ACyuE5Q59CflPsxrs6K7KtKNaDpzV01Znp16EMTSlRqq8ZJp+jPyvbSv7M146N4mS5sPs119nvgsQaWDDYfCEgMRzxkZx1717PqH7IPj6axh1rwXrejeItNu4lntpY5TBJJGwyDtb5Rx/tmvRf2tfgY+pRS/FPwpZ7rmBP8AicW8Y5kjUYE4HqoGG9hnsc8J+zN+0IPAFyngnxhdH/hHrqTNvcNk/YZWPOf+mZPX0PPrX59HL8Pg8W8Jjk+V/DJO3/A9ez8j8fhlGDy7MZZfmqajL4Jp29L9LPZ6aPyPJPGPwz8e+ACh8X+Fr7TYpH8tJ5E3Qu+CdqyLlScAnGc4Brma/Qj9pbQrXxd8EdantjHcfY44tUtZEIYYQgllI65jLjPvX571yZxl0ctrqnB3i1dXPP4jyaOS4pUqUnKMldN/NdAorX8HaXYa34s0bRtUklS0v7+C2naIgOEdwpKkggHn0NfVGr/sL6DKxbQfH1/bDsl3ZpP/AOPKyfyrHB5ZicfBzoK9vNL8zmy7I8bmtOVTCR5uV2eqT/Gx8gUV9RS/sLa0G/c/EKyYf7Vg4P6Oantv2FL1mH2z4kQIvfytMLH9ZBXQsgzFu3s/xX+Z2LhLOW7ex/GP+Z8rUV9GfGn9mjwj8JfhxL4mi8RapqOpm6gtohII44fmJ3HYAW+6D/FXznXFjMHVwNT2VZWdr9zy8xy3EZVVVDEq0rX3vv6CojyOscaM7uQqqoyST0AFeoeG/wBmf4z+JVSWLwhNp8L4Ik1F1t8D3Rvn/wDHayPgZ4Z/4S34teGNIZcxC/S6mGMgxw/vWB+oTH4195/FP4p+G/hR4bk1zXZg87grZ2StiS6k/ur6AZ5boB+APrZRlVDF0Z4nFScYR/pn0HDuQYXMMNUxuOm404O2ll0u9Wn3Wx8TfFD4Fv8ACLQbW58V+LbKbXNQfFrpljEzjyx9+R5W24A6ABTknrwa0/2Wvha/j/x/FrOoQMdH8PMl3OSvyyz5zFFn6jcfZfeuRubnx38fviSGKteatq0oVEBIitYR2GfuxoOT+J5J5++/hj8O9G+F/hCz8K6Ou7yh5lzOR81xOQN8h+pHA7AAdq6Mqy6lj8Y61KNqMO/V9P8AN/cdmQZPQzbMXiaEOXD03pe7cmtr3+9rZKy6nWUUUV96frQUUUUAIQGBVgCCMEHvXyB+0V+y/c6dPc+Ofhrp7S2Tlpr7S4Vy0B6mSFe6dSV6jtxwPsCiuHH5fRzGl7OqvR9UeXm2UYfOaHsa69H1T8v1XU/Pz4U/tAaz4H0y48EeKYJdZ8KX0T2s1qW/fWsbgq5hJ46E/IeM9Mc15JKI1kdYnLIGIViMEjscV92/GL9lnwn8RHn13w40eha9J8zuif6PcN/00QfdJ/vLz3INfIPj74ReP/htdPD4o0CeK3U4S9iHmW0g7ESDgfQ4PtXweaYDHYWMYVvehHZ+Xby9H8j8mz3KM0wEI0sTedOF+WS1sn0fVbbPRdDlbC8l0++t7+A4ltpUmQ/7SkEfqK/VOzuor6zgvYDmO4jWVD6qwyP51+UtfZXw9/bA+HVh4Y0jQ/ElnrFrdWFlBayzrAssbsiBSww27Bxnp3rt4ax1HCSqQrSUU7Wv5X/zPS4IzTDZfOtTxM1FS5bX7q/+Z9LUV5HD+1b8CpUDN4xkiP8AdfTrnP6Rmqt/+118EbNC0Gu316QPu2+nygn/AL+BR+tfXvM8Elf2sfvR+jPPMsSu8RD/AMCX+ZzP7b2oLB8PNF04N813qwfHqqRPn9WFfFde0/tJfHHRPjFc6JD4e0++tbXSBcFjdBVMjSeXggKT0Cd/WvGYIJ7qZLa2hkmlkYKkcalmYnoAByTX5/nmJhi8bKdJ3jol93+Z+Q8U42lmGaTq0HzRskmuun+dzuvg58SLP4Va/e+LW0s6hqCWL22nwsdsayuy5dz1wFDDA5O7t1qNm+JXx+8c5P2jWNXuzxgbYbaLP/fMca5//WTz3nwv/ZL8d+M2g1PxUreHNJZgx89M3Uq99sf8OemXx64NfYvgL4ceEfhro66L4T0qO2j6yzN8007f3nfqx/QdgK9DLsnxmNpxp124Uk726v5fq/kexk3DmY5nRjSxTdPDp3ts5N9bfq9uiZzXwS+COg/B/RCkRS81u8Qfbr8r1/6Zx91jB/Enk9gPS6KK+5oUKeGpqlSVkj9TwuFo4KjGhQjaK2QUUUVqdAUUUUAFFFFABTJoIbmF7e4hSWKRSro6hlYHqCDwRT6KA3PJvFv7L3wd8WB5P+EdOkXDknztLfyMH/cwY/8Ax2vLdV/YWtWdjonxBlRP4VurEOR9SrDP5V9V0V5lfJ8DiHedNX8tPyseHiuG8qxj5qtFX8vd/Kx8ZT/sOeOFci28ZaFInYukyH8gp/nVqw/YY8SuR/afjzTIR3EFrJJ/6EVr7DorlXDmXp35H97OFcF5Onf2b/8AAn/mfN3h39iLwPYyLN4l8T6rqm058qBUto29j95vyIr2bwf8LPh94C+bwp4VsbGbbtNwE3zEehkbLfrXV0V6GHy3CYR3o00n36/e9T1sHkuX5e74ekk++7+93YUUUV2nqBRRRQAUUUUAf//Z",
      "name": {
        "last": "",
        "first": "#Play"
      },
      "isOwn": false,
      "type": "Company",
      "fullName": "#Play ",
      "id": "55ba0301d79a3a343900000d"
    },
    ...
   ]
}
     */
    router.get('/', handler.getForView);
    router.get('/amountLeftCalc', handler.amountLeftCalc);
    router.get('/getForProject', handler.getForProject);

    router.post('/', handler.create);
    router.post('/supplier', handler.createPayOut);
    router.post('/salary', handler.salaryPayOut);
    router.patch('/:byType', handler.putchBulk);

    router.delete('/:id', handler.remove);

    /**
     *@api {delete} /payment/ Request for deleting selected Payments
     *
     * @apiVersion 0.0.1
     * @apiName deletePayments
     * @apiGroup Payment
     *
     * @apiParamExample {json} Request-Example:
{
      "contentType": "DividendPayments",
      "ids": [
            "572ca04a55c631a239a57cfc",
            "572ca03c526c630639837960"
      ]
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":true
}
     */
    router.delete('/', handler.bulkRemove);

    return router;
};
