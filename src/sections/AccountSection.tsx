import type { User, UserPackage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, Mail, Phone, Package, CreditCard, Settings, LogOut, Edit2, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

interface AccountSectionProps {
  user: User;
  userPackages: UserPackage[];
}

export function AccountSection({ user, userPackages }: AccountSectionProps) {
  const { tr } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const totalClassesUsed = userPackages.reduce((sum, pkg) => sum + pkg.classesUsed, 0);
  const activePackagesCount = userPackages.filter(pkg => pkg.isActive).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white/80 text-[#8b7355] px-4 py-2 rounded-full text-sm mb-4 shadow-soft">
          <Sparkles className="w-4 h-4 text-[#d4a574]" />
          <span className="font-medium">{tr({ es: 'Perfil', en: 'Profile' })}</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl text-[#5c4a3d] mb-3">
          {tr({ es: 'Mi cuenta', en: 'My account' })}
        </h2>
        <p className="text-[#8b7355] max-w-xl mx-auto">
          {tr({ es: 'Gestiona tu perfil y preferencias', en: 'Manage your profile and preferences' })}
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-8 bg-white/80 border-none shadow-soft">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-28 h-28 border-4 border-[#f5e8e8]">
              <AvatarFallback className="bg-gradient-to-br from-[#d4a574] to-[#c49a6c] text-white text-3xl font-serif">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-serif text-2xl font-semibold text-[#5c4a3d]">{user.name}</h3>
              <p className="text-[#8b7355]">{user.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-5">
                <div className="bg-[#f5e8e8] px-5 py-3 rounded-2xl">
                  <p className="font-serif text-2xl font-bold text-[#d4a574]">{activePackagesCount}</p>
                  <p className="text-sm text-[#8b7355]">{tr({ es: 'Paquetes activos', en: 'Active packages' })}</p>
                </div>
                <div className="bg-[#e8f0e8] px-5 py-3 rounded-2xl">
                  <p className="font-serif text-2xl font-bold text-[#a8c5a8]">{totalClassesUsed}</p>
                  <p className="text-sm text-[#8b7355]">{tr({ es: 'Clases tomadas', en: 'Classes taken' })}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 border-[#d4a574] text-[#d4a574] hover:bg-[#f5e8e8] rounded-full"
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {isEditing ? tr({ es: 'Guardar', en: 'Save' }) : tr({ es: 'Editar', en: 'Edit' })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="mb-8 bg-white/80 border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl text-[#5c4a3d]">
            <div className="w-8 h-8 bg-[#f5e8e8] rounded-lg flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-[#d4a574]" />
            </div>
            {tr({ es: 'Información personal', en: 'Personal information' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#6b5b4f]">{tr({ es: 'Nombre completo', en: 'Full name' })}</Label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a08060]" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="pl-11 bg-[#faf8f5] border-[#e8e0d5] rounded-xl focus:border-[#d4a574] focus:ring-[#d4a574]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#6b5b4f]">{tr({ es: 'Correo electrónico', en: 'Email address' })}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a08060]" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-11 bg-[#faf8f5] border-[#e8e0d5] rounded-xl focus:border-[#d4a574] focus:ring-[#d4a574]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#6b5b4f]">{tr({ es: 'Teléfono', en: 'Phone number' })}</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a08060]" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="pl-11 bg-[#faf8f5] border-[#e8e0d5] rounded-xl focus:border-[#d4a574] focus:ring-[#d4a574]"
                />
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full border-[#e8e0d5]">
                {tr({ es: 'Cancelar', en: 'Cancel' })}
              </Button>
              <Button onClick={handleSave} className="bg-[#d4a574] hover:bg-[#c49a6c] text-white rounded-full">
                {tr({ es: 'Guardar cambios', en: 'Save changes' })}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="cursor-pointer hover:shadow-soft-lg transition-all border-none shadow-soft bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f5e8e8] rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-[#d4a574]" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-[#5c4a3d]">{tr({ es: 'Mis paquetes', en: 'My packages' })}</h4>
                <p className="text-sm text-[#8b7355]">{tr({ es: 'Ver historial de compras', en: 'View purchase history' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-soft-lg transition-all border-none shadow-soft bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e8f0e8] rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#a8c5a8]" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-[#5c4a3d]">{tr({ es: 'Métodos de pago', en: 'Payment methods' })}</h4>
                <p className="text-sm text-[#8b7355]">{tr({ es: 'Gestionar tarjetas', en: 'Manage cards' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-soft-lg transition-all border-none shadow-soft bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f0e8f0] rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-[#c9a8c5]" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-[#5c4a3d]">{tr({ es: 'Configuración', en: 'Settings' })}</h4>
                <p className="text-sm text-[#8b7355]">{tr({ es: 'Preferencias de cuenta', en: 'Account preferences' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <div className="mt-10 pt-8 border-t border-[#e8e0d5]">
        <Button variant="outline" className="text-[#c9a8a8] border-[#e8d5d5] hover:bg-[#faf5f5] rounded-full">
          <LogOut className="w-4 h-4 mr-2" />
          {tr({ es: 'Cerrar sesión', en: 'Sign out' })}
        </Button>
      </div>
    </div>
  );
}
