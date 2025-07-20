export const getEligibleTriggers = async (req, res) => {
    try {
        const body = req.body
        console.log(body);
        
        res.status(200).json({
            message: true,
            data: body
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}