import React, { useState } from 'react';
import { Tag } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TagFormProps {
  tag?: Tag;
  onSubmit: () => void;
  onCancel: () => void;
}

const TagForm: React.FC<TagFormProps> = ({
  tag,
  onSubmit,
  onCancel,
}) => {
  const { addTag, updateTag } = useTaskStore();
  const isEditing = !!tag;
  
  const [name, setName] = useState(tag?.name || '');
  const [color, setColor] = useState(tag?.color || '#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagData = {
      name,
      color,
    };
    
    if (isEditing && tag) {
      updateTag(tag.id, tagData);
    } else {
      addTag(tagData);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tag Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter tag name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Tag' : 'Create Tag'}
        </Button>
      </div>
    </form>
  );
};

export default TagForm;