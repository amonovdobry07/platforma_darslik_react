import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import CourseCard from "../components/course/CourseCard";
import { coursesAPI, categoriesAPI } from "../api/courses";
import { CourseCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  // Kategoriyalarni yuklash
  useEffect(() => {
    categoriesAPI
      .getAll()
      .then((data) => setCategories(data.results || data))
      .catch((err) => console.error(err));
  }, []);

  // Kurslarni yuklash (filter o'zgarganda)
  useEffect(() => {
    setIsLoading(true);
    const params = {};

    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedLevel) params.level = selectedLevel;
    if (ordering) params.ordering = ordering;

    const debounce = setTimeout(() => {
      coursesAPI
        .getAll(params)
        .then((data) => {
          setCourses(data.results || data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, selectedCategory, selectedLevel, ordering]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedLevel("");
    setOrdering("-created_at");
  };

  const hasActiveFilters = search || selectedCategory || selectedLevel;

  return (
    <div className="courses-page">
      <div className="container">
        {/* ============ HEADER ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="courses-header"
        >
          <h1>
            Barcha <span className="gradient-text">kurslar</span>
          </h1>
          <p>O'zingizga mos kursni toping va o'rganishni boshlang</p>
        </motion.div>

        {/* ============ SEARCH & TOGGLE ============ */}
        <div className="courses-toolbar">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Kurs nomini qidiring..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>
                <X size={18} />
              </button>
            )}
          </div>

          <button
            className={`filter-toggle ${isFilterOpen ? "active" : ""}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal size={18} />
            <span>Filter</span>
            {hasActiveFilters && <span className="filter-dot"></span>}
          </button>
        </div>

        {/* ============ FILTERS ============ */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="filters-panel"
          >
            <div className="filter-row">
              {/* Category */}
              <div className="filter-group">
                <label>Kategoriya</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Barchasi</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div className="filter-group">
                <label>Daraja</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Barchasi</option>
                  <option value="beginner">Boshlang'ich</option>
                  <option value="intermediate">O'rta</option>
                  <option value="advanced">Yuqori</option>
                </select>
              </div>

              {/* Ordering */}
              <div className="filter-group">
                <label>Saralash</label>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="filter-select"
                >
                  <option value="-created_at">Eng yangi</option>
                  <option value="created_at">Eng eski</option>
                  <option value="price">Narxi: past → yuqori</option>
                  <option value="-price">Narxi: yuqori → past</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <X size={16} />
                  Tozalash
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ============ RESULTS ============ */}
        <div className="courses-results">
          {isLoading ? (
            <div className="courses-grid">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon={hasActiveFilters ? Search : BookOpen}
              title={
                hasActiveFilters
                  ? "Kurs topilmadi"
                  : "Hozircha kurslar yo'q"
              }
              description={
                hasActiveFilters
                  ? "Qidiruv shartlaringizga mos kurs topilmadi. Boshqa so'z bilan qidirib ko'ring yoki filterlarni tozalang."
                  : "Tez orada yangi kurslar qo'shiladi. Iltimos keyinroq qaytib keling!"
              }
              actionLabel={hasActiveFilters ? "Filterlarni tozalash" : null}
              actionIcon={RotateCcw}
              actionOnClick={clearFilters}
            />
          ) : (
            <>
              <div className="courses-count">
                <span className="gradient-text">{courses.length}</span> ta kurs
                topildi
              </div>

              <div className="courses-grid">
                {courses.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;