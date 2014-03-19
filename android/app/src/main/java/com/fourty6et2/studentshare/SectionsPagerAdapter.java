package com.fourty6et2.studentshare;

import com.fourty6et2.studentshare.fragments.borrow.BorrowSectionFragment;
import com.fourty6et2.studentshare.fragments.buy.BuySectionFragment;
import com.fourty6et2.studentshare.fragments.chat.ChatSectionFragment;
import com.fourty6et2.studentshare.fragments.sell.SellSectionFragment;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentPagerAdapter;


public class SectionsPagerAdapter extends FragmentPagerAdapter {

	private FragmentActivity _activity;
	private static final int SectionsCount = 4;

    BorrowSectionFragment _borrowSectionFragment;
    SellSectionFragment _sellSectionFragment;
    BuySectionFragment _buySectionFragment;
    ChatSectionFragment _chatSectionFragment;

	public SectionsPagerAdapter(FragmentActivity activity) {
		super(activity.getSupportFragmentManager());
		_activity = activity;
	}

//	@Override
//	public Fragment getItem(int position) {
//
//        if (position == Section.Borrow.ordinal())
//			return new BorrowSectionFragment();
//
//        if (position == Section.Sell.ordinal())
//			return new SellSectionFragment();
//
//        if (position == Section.Buy.ordinal())
//            return new BuySectionFragment();
//
//        if (position == Section.Chat.ordinal())
//			return new ChatSectionFragment();
//
//		return null;
//	}

    @Override
    public Fragment getItem(int position) {

        Fragment result = null;

        if (position == Section.AsEnum.Borrow.ordinal()) {
            if (_borrowSectionFragment == null)
                _borrowSectionFragment = new BorrowSectionFragment();

            result = _borrowSectionFragment;
        }

        if (position == Section.AsEnum.Sell.ordinal()) {
            if (_sellSectionFragment == null)
                _sellSectionFragment = new SellSectionFragment();

            result = _sellSectionFragment;
        }

        if (position == Section.AsEnum.Buy.ordinal()) {
            if (_buySectionFragment == null)
                _buySectionFragment = new BuySectionFragment();

            result = _buySectionFragment;
        }

        if (position == Section.AsEnum.Chat.ordinal()) {
            if (_chatSectionFragment == null)
                _chatSectionFragment = new ChatSectionFragment();

            result = _chatSectionFragment;
        }

        return result;
    }

	@Override
	public int getCount() {
        return SectionsCount;
	}

	@Override
	public CharSequence getPageTitle(int position) {

        if (position == Section.AsEnum.Borrow.ordinal())
			return _activity.getString(R.string.BorrowSectionTitle);

        if (position == Section.AsEnum.Sell.ordinal())
			return _activity.getString(R.string.SellSectionTitle);

        if (position == Section.AsEnum.Buy.ordinal())
			return _activity.getString(R.string.BuySectionTitle);

        if (position == Section.AsEnum.Chat.ordinal())
			return _activity.getString(R.string.ChatSectionTitle);

		return null;
	}
}
