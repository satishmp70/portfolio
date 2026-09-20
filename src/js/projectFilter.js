/**
 * =========================================================================
 * PROJECT CATEGORY FILTERING MODULE
 * =========================================================================
 */

export function setupProjectFilter(onFilterChange) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedCategory = e.currentTarget.getAttribute('data-category');
      
      filterButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      if (typeof onFilterChange === 'function') {
        onFilterChange(selectedCategory);
      }
    });
  });
}
