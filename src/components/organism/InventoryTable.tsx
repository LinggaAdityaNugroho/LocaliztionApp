import { DeviceTable } from "../molecules/DeviceTable";
import { DevicePagination } from "../molecules/DevicePagination";
import { DevicePageSize } from "../molecules/DevicePageSize";

export const InventoryTable = ({ header, table, columns, loading }: any) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
            <div className="p-32 text-center font-black text-slate-300 animate-pulse tracking-widest italic text-xl">SYNCING...</div>
        ) : (
            <div className="flex flex-col">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center ">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">{header}</h3>
                    <DevicePageSize table={table} />
                </div>
                <div className="px-6 py-4 overflow-x-auto min-h-[400px]">
                    <DeviceTable table={table} columns={columns} />
                </div>
                <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                    <DevicePagination table={table} />
                </div>
            </div>
        )}
    </div>
);