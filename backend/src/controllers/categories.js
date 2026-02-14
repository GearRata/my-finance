export const create = async (req, res) => {
    try {
        res.send("created");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const list = async (req, res) => {
    try {
        res.send("list")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        res.send("removed")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}