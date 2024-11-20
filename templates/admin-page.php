<div class="wrap">
    <h1>Firebase Leaderboard Settings</h1>
    <form method="post" action="options.php">
        <?php settings_fields('firebase_leaderboard_settings'); ?>
        <table class="form-table">
            <tr>
                <th>Firebase Database URL</th>
                <td>
                    <input type="text" name="firebase_db_url" 
                           value="<?php echo esc_attr(get_option('firebase_db_url')); ?>" 
                           class="regular-text">
                </td>
            </tr>
            <tr>
                <th>API Key</th>
                <td>
                    <input type="text" name="firebase_api_key" 
                           value="<?php echo esc_attr(get_option('firebase_api_key')); ?>" 
                           class="regular-text">
                </td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
</div> 