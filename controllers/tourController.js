const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  //bu sekilde fill yapiyoruz req.query post ayri ayri key value yerine
  //limit=5&sort=-ratingsAverage,price&fields=ratingsAverage,price
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.fields = 'name,price,ratingsAverage,price,summary,difficulty';
  next();
};

// 2) ROUTE HANDELERS FUNCTIONS
exports.getAllTours = async (req, res) => {
  try {
    //query.sort('difficulty price')  once difficulty gore siraliyo ayni varsa ornek easy easy ikitane bunlarida kendi arasinda price gore olucak sekilde siraliyo

    // 3) Field limiting
    // query.select(name difficulty price)  gibi

    // 4) Pagination

    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    console.log('test1', features.query);
    const tours = await features.query;
    //query.sort().select().skip().limit()

    //const tours = await Tour.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.lenght,
      data: { tours },
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};
