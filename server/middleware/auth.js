export const protect = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: 'Unauthorized'
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: error.msg
        });
    }
}
