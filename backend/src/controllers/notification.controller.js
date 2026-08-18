const Notification = require('../models/Notification');

const listNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.id, read: false },
    });

    return res.json({ notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar notificações' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    await notification.update({ read: true });

    return res.json({ notification });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao marcar notificação' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );

    return res.json({ message: 'Todas marcadas como lidas' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao marcar notificações' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    await notification.destroy();

    return res.json({ message: 'Notificação removida' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao remover notificação' });
  }
};

module.exports = { listNotifications, markAsRead, markAllAsRead, deleteNotification };
