export default function auth(req, res, next) {
    if (!req.session.user_id) {
        return res.status(401).send('Access Denied');
    }
    next();
};