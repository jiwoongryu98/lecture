interface PresenterProfile {
  name: string;
  role: string;
  organization: string;
  focus?: string;
  organizationUrl?: string;
  highlights: {
    title: string;
    detail?: string;
    href?: string;
  }[];
}

// Personal details stay in an optional, Git-ignored file. Public checkouts use placeholders.
const profiles = import.meta.glob<PresenterProfile>('./private/presenter.json', { eager: true, import: 'default' });
export const presenterProfile: PresenterProfile = profiles['./private/presenter.json'] ?? {
  name: '[발표자 이름]',
  role: '[현재 역할]',
  organization: '[현재 소속]',
  highlights: [
    { title: '[이전 소속]', detail: '[관련 경험]' },
    { title: '[연구 경험]', detail: '[논문 또는 연구 분야]' },
    { title: '[학교]', detail: '[전공 및 학위]' },
  ],
};
