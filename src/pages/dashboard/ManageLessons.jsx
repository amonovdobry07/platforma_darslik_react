import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Clock,
  PlayCircle,
  X,
  Save,
  Loader2,
  BookOpen,
  Eye,
  EyeOff,
  Trophy, // ← YANGI
} from "lucide-react";
import { coursesAPI } from "../../api/courses";
import { lessonsAPI } from "../../api/lessons";
import useAuthStore from "../../store/authStore";
import EmptyState from "../../components/ui/EmptyState";
import "./ManageLessons.css";

function ManageLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    duration_minutes: "",
    order: "",
    is_free: false,
  });

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const courseData = await coursesAPI.getOne(courseId);

      if (courseData.instructor?.id !== user?.id) {
        toast.error("Siz bu kursni boshqara olmaysiz!");
        navigate("/dashboard/instructor/courses");
        return;
      }

      setCourse(courseData);

      const lessonsData = await lessonsAPI.getByCourse(courseId);
      setLessons(lessonsData.results || lessonsData);
    } catch (error) {
      toast.error("Ma'lumotlar yuklanmadi");
      navigate("/dashboard/instructor/courses");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      content: "",
      video_url: "",
      duration_minutes: "",
      order: lessons.length + 1,
      is_free: false,
    });
    setShowForm(true);
  };

  const openEditForm = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      content: lesson.content,
      video_url: lesson.video_url || "",
      duration_minutes: lesson.duration_minutes,
      order: lesson.order,
      is_free: lesson.is_free,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Sarlavha va kontent majburiy!");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes) || 0,
        order: parseInt(formData.order) || 0,
        course: parseInt(courseId),
      };

      if (editingLesson) {
        await lessonsAPI.update(courseId, editingLesson.id, data);
        toast.success("Dars yangilandi! ✓");
      } else {
        await lessonsAPI.create(courseId, data);
        toast.success("Yangi dars qo'shildi! 🎉");
      }

      await loadData();
      closeForm();
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await lessonsAPI.delete(courseId, deleteConfirm.id);
      toast.success("Dars o'chirildi");
      setLessons(lessons.filter((l) => l.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ml-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="manage-lessons">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          className="ml-back"
          onClick={() => navigate("/dashboard/instructor/courses")}
        >
          <ArrowLeft size={18} />
          Kurslarimga qaytish
        </button>

        <div className="ml-header">
          <div>
            <div className="ml-course-name">
              <BookOpen size={16} />
              <span>{course?.title}</span>
            </div>
            <h1>
              <span className="gradient-text">Darslar</span> boshqaruvi
            </h1>
            <p>Kursingizga darslar qo'shing va boshqaring</p>
          </div>

          {lessons.length > 0 && (
            <button className="btn btn-primary" onClick={openCreateForm}>
              <Plus size={18} />
              Yangi dars
            </button>
          )}
        </div>

        {/* Stats - faqat darslar bor bo'lsa */}
        {lessons.length > 0 && (
          <div className="ml-stats">
            <div className="ml-stat">
              <strong>{lessons.length}</strong>
              <span>Jami darslar</span>
            </div>
            <div className="ml-stat">
              <strong>{lessons.filter((l) => l.is_free).length}</strong>
              <span>Bepul darslar</span>
            </div>
            <div className="ml-stat">
              <strong>
                {lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)}
              </strong>
              <span>Jami daqiqa</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* LESSONS LIST yoki Empty State */}
      {lessons.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Hali dars yo'q"
          description="Kursingizga birinchi darsni qo'shib, talabalar uchun ta'lim yo'lini boshlang. Video, matn va boshqa ma'lumotlarni qo'shishingiz mumkin."
          actionLabel="Birinchi dars qo'shish"
          actionIcon={Plus}
          actionOnClick={openCreateForm}
        />
      ) : (
        <div className="ml-list">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="ml-lesson-card"
            >
              <div className="ml-lesson-number">{lesson.order}</div>

              <div className="ml-lesson-info">
                <div className="ml-lesson-title">{lesson.title}</div>
                <div className="ml-lesson-meta">
                  <div className="ml-meta-item">
                    <Clock size={14} />
                    <span>{lesson.duration_minutes} min</span>
                  </div>
                  {lesson.video_url && (
                    <div className="ml-meta-item">
                      <PlayCircle size={14} />
                      <span>Video</span>
                    </div>
                  )}
                  {lesson.is_free ? (
                    <div className="ml-meta-item ml-free">
                      <Eye size={14} />
                      <span>Bepul</span>
                    </div>
                  ) : (
                    <div className="ml-meta-item ml-paid">
                      <EyeOff size={14} />
                      <span>Pulli</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-lesson-actions">
                <button
                  className="ml-action-btn"
                  onClick={() =>
                    navigate(
                      `/dashboard/instructor/quiz/${courseId}/${lesson.id}`,
                    )
                  }
                  title="Test boshqaruvi"
                >
                  <Trophy size={18} />
                </button>
                <button
                  className="ml-action-btn"
                  onClick={() => openEditForm(lesson)}
                  title="Tahrirlash"
                >
                  <Edit size={18} />
                </button>
                <button
                  className="ml-action-btn ml-action-delete"
                  onClick={() => setDeleteConfirm(lesson)}
                  title="O'chirish"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-card ml-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ml-form-header">
              <h2>
                {editingLesson ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
              </h2>
              <button className="modal-close" onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ml-form">
              <div className="form-group">
                <label>Dars sarlavhasi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Masalan: Kirish va o'rnatish"
                  required
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label>Dars kontenti *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Dars haqida batafsil yozing..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Video URL
                  <span className="form-label-hint">(YouTube yoki Vimeo)</span>
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="ml-form-grid">
                <div className="form-group">
                  <label>Davomiyligi (daqiqa) *</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: e.target.value,
                      })
                    }
                    placeholder="15"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Tartib raqami *</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    placeholder="1"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="ml-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) =>
                      setFormData({ ...formData, is_free: e.target.checked })
                    }
                  />
                  <div className="ml-checkbox-content">
                    <strong>Bu darsni bepul preview qilish</strong>
                    <span>Yozilmagan foydalanuvchilar ham ko'ra olishadi</span>
                  </div>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeForm}
                  disabled={isSaving}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="spinner" size={18} /> Saqlanmoqda...
                    </>
                  ) : (
                    <>
                      <Save size={18} />{" "}
                      {editingLesson ? "Yangilash" : "Qo'shish"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon-danger">
              <Trash2 size={32} />
            </div>
            <h3>Darsni o'chirasizmi?</h3>
            <p>
              <strong>"{deleteConfirm.title}"</strong> darsi o'chiriladi. Bu
              amalni qaytarib bo'lmaydi!
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
              >
                Bekor qilish
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="spinner" size={18} /> O'chirilmoqda...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} /> O'chirish
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ManageLessons;
