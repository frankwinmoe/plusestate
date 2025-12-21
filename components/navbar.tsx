import { Link } from '@/i18n/navigation';
import { hasEnvVars } from '@/lib/utils';
import { Suspense } from 'react';
import { EnvVarWarning } from './env-var-warning';
import { AuthButton } from './auth-button';

const Navbar = () => (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-bold text-lg">
                <Link href="/">PlusEstate</Link>
            </div>
            {hasEnvVars ? (
                <Suspense>
                    <AuthButton />
                </Suspense>
            ) : (
                <EnvVarWarning />
            )}
        </div>
    </nav>
);

export default Navbar;
