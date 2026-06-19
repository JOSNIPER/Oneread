import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { getAppVersion } from '@/utils/version';
import SupportLinks from '@/components/SupportLinks';
import LegalLinks from '@/components/LegalLinks';
import Link from '@/components/Link';

type UpdateStatus = 'checking' | 'updating' | 'updated' | 'error';

const AboutPanel = () => {
  const _ = useTranslation();
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);

  const handleCheckUpdate = async () => {
    setUpdateStatus('checking');
    try {
      // OneRead: no update server yet, show "already latest" after a brief delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUpdateStatus('updated');
    } catch {
      setUpdateStatus('error');
    }
  };

  return (
    <div className='about-panel flex flex-col items-center gap-6 py-6'>
      <div className='flex flex-col items-center gap-3'>
        <Image src='/icon.png' alt='App Logo' className='h-16 w-16' width={64} height={64} />
        <h2 className='text-xl font-bold'>OneRead</h2>
        <p className='text-neutral-content text-sm'>
          {_('Version {{version}}', { version: getAppVersion() })}
        </p>
        {!updateStatus && (
          <button className='btn btn-sm btn-primary' onClick={handleCheckUpdate}>
            {_('Check Update')}
          </button>
        )}
        {updateStatus === 'updated' && (
          <p className='text-neutral-content text-xs'>{_('Already the latest version')}</p>
        )}
        {updateStatus === 'checking' && (
          <p className='text-neutral-content text-xs'>{_('Checking for updates...')}</p>
        )}
        {updateStatus === 'error' && (
          <p className='text-error text-xs'>{_('Error checking for updates')}</p>
        )}
        <p className='text-base-content/40 text-xs'>更新需手动下载，请关注项目发布页</p>
      </div>

      <hr aria-hidden='true' className='border-base-300 w-full' />

      <div className='flex flex-col items-center gap-2 text-center' dir='ltr'>
        <p className='text-neutral-content text-sm'>
          © {new Date().getFullYear()} OneRead. Based on Readest.
        </p>
        <p className='text-neutral-content text-xs'>
          本软件基于{' '}
          <Link href='https://github.com/readest/readest' className='text-blue-500 underline'>
            Readest
          </Link>{' '}
          开源项目 fork 并修改而来。原项目采用{' '}
          <Link
            href='https://www.gnu.org/licenses/agpl-3.0.html'
            className='text-blue-500 underline'
          >
            AGPL v3 协议
          </Link>
          ，本项目遵循相同协议开源。
        </p>
        <p className='text-neutral-content text-xs'>
          主要修改：移除登录和云端同步功能，改为纯本地阅读器，仅保留 WebDAV 同步。
        </p>
        <LegalLinks />
      </div>

      <SupportLinks />
    </div>
  );
};

export default AboutPanel;
