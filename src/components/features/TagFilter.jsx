import Tag from '../ui/Tag.jsx';

export default function TagFilter({ availableTags = [], selectedTags = [], onToggle }) {
  if (!availableTags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {availableTags.map((tag) => (
        <Tag
          key={tag}
          active={selectedTags.includes(tag)}
          onClick={() => onToggle(tag)}
          className="cursor-pointer"
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
