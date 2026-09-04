class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: String(this.queryStr.keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                $options: "i",
            }
        } : { }

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
      const filters = {};
      const category = typeof this.queryStr.category === 'string'
          ? this.queryStr.category.trim()
          : '';
      const price = {};
      const minPrice = Number(this.queryStr['price[gte]']);
      const maxPrice = Number(this.queryStr['price[lte]']);
      const minRating = Number(this.queryStr['ratings[gte]']);

      if (category) filters.category = category;
      if (Number.isFinite(minPrice) && minPrice >= 0) price.$gte = minPrice;
      if (Number.isFinite(maxPrice) && maxPrice >= 0) price.$lte = maxPrice;
      if (Object.keys(price).length) {
          if (price.$gte !== undefined && price.$lte !== undefined && price.$gte > price.$lte) {
              [price.$gte, price.$lte] = [price.$lte, price.$gte];
          }
          filters.price = price;
      }
      if (Number.isFinite(minRating) && minRating >= 0 && minRating <= 5) {
          filters.ratings = { $gte: minRating };
      }
      if (this.queryStr.availability === 'in-stock') filters.Stock = { $gt: 0 };
      if (this.queryStr.availability === 'out-of-stock') filters.Stock = { $lte: 0 };

      this.query = this.query.find(filters);
      return this;
    }

    sort() {
        const sortMap = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating_desc: { ratings: -1, numOfReviews: -1 },
            newest: { createdAt: -1 },
            name_asc: { name: 1 }
        };

        this.query = this.query.sort(sortMap[this.queryStr.sort] || { createdAt: -1 });
        return this;
    }

    pagination(resultPerPage) {
        const parsedPage = Number(this.queryStr.page);
        const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const parsedLimit = Number(this.queryStr.limit);
        const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
            ? Math.min(parsedLimit, 50)
            : resultPerPage;

        const skip = limit * (currentPage - 1);

        this.query = this.query.limit(limit).skip(skip);

        return this;
    } 

};

module.exports = ApiFeatures;
