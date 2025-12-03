import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  isEditing: boolean;
  onSave: () => void;
  onEdit: () => void;
  saving?: boolean;
}

export function SectionHeader({
  icon,
  title,
  description,
  isEditing,
  onSave,
  onEdit,
  saving = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <Button onClick={onSave} disabled={saving} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        ) : (
          <Button onClick={onEdit} variant="outline" size="sm">
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
