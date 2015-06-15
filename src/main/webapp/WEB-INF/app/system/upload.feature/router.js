var json = require('cdeio/response').json,
    router = exports.router = require('cdeio/router').createRouter(),
    upload = require('cdeio/util/upload'),
    response = require('ringo/jsgi/response'),
    {notFound} = require('cdeio/response'),
    {getOptionInProperties} = require('cdeio/config'),
    {mark} = require('cdeio/mark'),
    {join} = require('cdeio/util/paths'),
    URLDecoder = java.net.URLDecoder,
    String = java.lang.String,
    CONFIG_UPLOAD_PATH = 'cdeio.upload.path';

router.post('/', upload.createRequestHandler('images'));
router.get('/image/:id', upload.createViewer());
router.get('/file/:id', upload.createViewer());

router.get('/:id', mark('services', 'system/upload').on(function(uploadSvc, request, id) {
    var attachment, filepath, filename, res;

    attachment = uploadSvc.getAttachmentById(id);
    if (!attachment) {
        return notFound('附件不存在');
    }

    filepath = join(getOptionInProperties(CONFIG_UPLOAD_PATH), attachment.path);

    filename = new String(new String(attachment.filename).bytes, 'ISO8859-1');

    res = response.static(filepath, attachment.contentType);
    res.headers['Content-Disposition'] = 'attachment;filename=' + filename;
    return res;
}));

router.get('/down-export-file/:filename', function(request, filename) {
    return response.static(join(getOptionInProperties('cdeio.upload.path'), 'export', URLDecoder.decode(filename, 'utf-8')), 'application/vnd.ms-excel');
});

router.get('/down-laboratory-exec-module/:filename', function(request, filename) {
    return response.static(join(getOptionInProperties('cdeio.webapp.path'), 'module/export/laboratory/laboratory-exec', URLDecoder.decode(filename, 'utf-8')), 'application/vnd.ms-excel');
});
router.get('/down-module-laboratory-exec/:filename', function(request, filename) {
    return response.static(join(getOptionInProperties('cdeio.webapp.path'), 'module/laboratory-meter', URLDecoder.decode(filename, 'utf-8')), 'application/vnd.ms-excel');
});

